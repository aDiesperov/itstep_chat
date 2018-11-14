using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ChatProject.Data;
using ChatProject.Hubs;
using ChatProject.Hubs.Models;
using ChatProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatProject.Controllers
{
    [Authorize, Route("api/chat")]
    public class ApiChatController : Controller
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ApiChatController(IHubContext<ChatHub> hubContext, UnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _hubContext = hubContext;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [Route("{guid}"), HttpGet]
        public async Task<ChatInfoReturn> Index(string guid)
        {
            if (String.IsNullOrEmpty(guid)) return null;

            ApplicationUser user = await _userManager.GetUserAsync(User);
            if (user == null)
                return null;

            var conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null || conversation.Participants.SingleOrDefault(part => part.User == user) == null)
                return null;

            var messages = conversation.Messages;
            var userConv = String.IsNullOrEmpty(conversation.Title) ? conversation.Participants.Single(p => p.User != user).User : null;

            ChatInfoReturn chatConversation = new ChatInfoReturn()
            {
                Title = userConv == null ? conversation.Title : userConv.FirstName + " " + userConv.LastName,
                Image = userConv == null ? "avatars/default.jpg" : userConv.Avatar,
                Group = userConv == null ? true : false,
                Status = conversation.Status,
                Creator = conversation.Creator == user,
                Participants = userConv == null ? conversation.Participants.Where(part => part.User != user).ToDictionary(part => part.User.Id, part => part.User.FirstName + " " + part.User.LastName) : null,
                Messages = messages.Select(msg => new MessageReturn()
                {
                    MessageId = msg.MessageId,
                    Image = msg.Sender.Avatar,
                    Text = msg.Text,
                    Attachments = msg.Attachments.ToDictionary(attch => attch.Location, attch => attch.Name),
                    IsMine = msg.Sender == user
                })
            };

            return chatConversation;
        }

        [Route("SendMessage"), HttpPost]
        public async Task SendMessage(string guid, string text, IEnumerable<IFormFile> files)
        {
            if (String.IsNullOrEmpty(guid) || (String.IsNullOrEmpty(text) && files.Count() == 0)) return;

            ApplicationUser user = await _userManager.GetUserAsync(User);
            if (user == null)
                return;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null || conversation.Status == StatusConversation.closed ||
                conversation.Participants.SingleOrDefault(part => part.User == user) == null)
                return;

            Message message = new Message()
            {
                Text = text ?? "",
                Sender = user,
                Created = DateTime.Now,
                Conversation = conversation,
            };

            await _unitOfWork.MessageRepository.CreateAsync(message);

            //upload files
            foreach (var file in files)
            {
                string name = "";
                do
                {
                    name = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                } while (System.IO.File.Exists("wwwroot/userFiles/" + name));

                using (FileStream stream = new FileStream("wwwroot/userFiles/" + name, FileMode.CreateNew))
                {
                    await file.CopyToAsync(stream);
                }

                await _unitOfWork.AttachmentRepository.CreateAsync(new Attachment()
                {
                    Message = message,
                    Name = file.FileName,
                    Location = name

                });
            }

            //send to users
            IEnumerable<ApplicationUser> users = conversation.Participants.Select(part => part.User);
            if (users.Count() > 0)
            {
                MessageReturn messagesReturn = new MessageReturn()
                {
                    MessageId = message.MessageId,
                    Image = message.Sender.Avatar,
                    Text = message.Text,
                    Conversation = conversation.Guid,
                    Attachments = message.Attachments?.ToDictionary(attch => attch.Location, attch => attch.Name)
                };

                foreach (var usr in users)
                {
                    messagesReturn.IsMine = message.Sender == usr;

                    await _hubContext.Clients.User(usr.Id).SendCoreAsync("ReceiveMessage", new[] { messagesReturn });
                }
            }
        }
        
        [Route("DeleteMessages/{guid}"), HttpPost]
        public async Task<bool> DeleteMessages(string guid, IEnumerable<int> msgs)
        {
            if (String.IsNullOrEmpty(guid) || msgs.Count() == 0) return false;
            ApplicationUser user = await _userManager.GetUserAsync(User);
            if (user == null)
                return false;

            var conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null || conversation.Participants.SingleOrDefault(part => part.User == user) == null)
                return false;

            var messages = conversation.Messages.Where(m => m.Sender == user && msgs.Any(msg => msg == m.MessageId)).ToList();
            if (messages.Count() != msgs.Count()) return false;

            foreach(var message in messages)
            {
                if (message.Attachments.Count() > 0)
                    foreach (var attachment in message.Attachments.ToList())
                    {
                        System.IO.File.Delete("wwwroot/userFiles/" + attachment.Location);
                        await _unitOfWork.AttachmentRepository.DeleteAsync(attachment);
                    }
                await _unitOfWork.MessageRepository.DeleteAsync(message);
            }

            DeletedMessagesReturn deletedMessages = new DeletedMessagesReturn()
            {
                Conversation = conversation.Guid,
                MessagesIds = msgs
            };

            foreach(var usr in conversation.Participants.Select(part => part.User))
            {
                await _hubContext.Clients.User(usr.Id).SendCoreAsync("ReceiveDeletedMessages", new[] { deletedMessages });
            }

            return true;
        }

        [Route("GetProfile"), HttpGet]
        public async Task<ApplicationUser> GetProfile() => await _userManager.GetUserAsync(User);

        [Route("AddParticipant/{guidConversation}"), HttpPost]
        public async Task<bool> AddParticipant(string name, string guidConversation)
        {
            if (String.IsNullOrEmpty(name) || String.IsNullOrEmpty(guidConversation))
                return false;
            ApplicationUser user = await _userManager.GetUserAsync(User);
            if (user == null)
                return false;
            ApplicationUser addUser = await _userManager.FindByNameAsync(name);
            if (addUser == null)
                return false;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guidConversation);
            if (conversation == null || String.IsNullOrEmpty(conversation.Title) || conversation.Creator != user) return false;

            Participant participant = conversation.Participants.SingleOrDefault(part => part.User == addUser);
            if (participant != null)
                return false;

            participant = new Participant()
            {
                Conversation = conversation,
                Type = TypeParticipant.user,
                User = addUser
            };

            await _unitOfWork.ParticipantRepository.CreateAsync(participant);

            await _hubContext.Clients.User(addUser.Id).SendCoreAsync("ReceiveCreatedChat", new[] { new ConversationReturn() {
                Guid = conversation.Guid,
                Text = conversation.Messages.LastOrDefault()?.Text ?? "",
                Image = "avatars/default.jpg",
                Title = conversation.Title
            } });

            return true;
        }
    }
}
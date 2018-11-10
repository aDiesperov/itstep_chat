using ChatProject.Data;
using ChatProject.Hubs.Models;
using ChatProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Hubs
{
    public class ChatHub : Hub
    {
        private UnitOfWork _unitOfWork;
        private UserManager<ApplicationUser> _userManager;

        public ChatHub(UnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }
        public async Task<bool> DeleteParticipant(string guidUser, string guidConversation)
        {
            if (String.IsNullOrEmpty(guidUser) || String.IsNullOrEmpty(guidConversation))
                return false;
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return false;
            ApplicationUser userDelete = await _userManager.FindByIdAsync(guidUser);
            if (userDelete == null)
                return false;


            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guidConversation);
            if (conversation == null) return false;
            if (String.IsNullOrEmpty(conversation.Title) || conversation.Creator != user) return false;

            Participant participant = conversation.Participants.SingleOrDefault(part => part.User == userDelete);
            if (participant == null)
                return false;

            await _unitOfWork.ParticipantRepository.DeleteAsync(participant);

            return true;
        }
        public async Task<bool> ChangeTitleConversation(string guid, string title)
        {
            if (String.IsNullOrEmpty(guid) || String.IsNullOrEmpty(title))
                return false;
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return false;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null) return false;
            if (String.IsNullOrEmpty(conversation.Title) || conversation.Creator != user) return false;

            conversation.Title = title;
            await _unitOfWork.ConversationRepository.UpdateAsync(conversation);

            IEnumerable<ApplicationUser> users = conversation.Participants.Select(part => part.User);
            foreach (ApplicationUser usr in users)
            {
                await Clients.User(usr.Id).SendCoreAsync("ReceiveChangeTitle", new[] { title, guid });
            }

            return true;
        }
        public async Task<bool> LeaveConversation(string guid)
        {
            if (String.IsNullOrEmpty(guid))
                return false;
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return false;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null) return false;

            Participant participant = conversation.Participants.SingleOrDefault(part => part.User == user);
            if (participant == null) return false;

            await _unitOfWork.ParticipantRepository.DeleteAsync(participant);

            if (String.IsNullOrEmpty(conversation.Title))
            {
                conversation.Status = StatusConversation.closed;
                conversation.Title = user.FirstName + " " + user.LastName;
                await _unitOfWork.ConversationRepository.UpdateAsync(conversation);

                IEnumerable<ApplicationUser> users = conversation.Participants.Select(part => part.User);
                foreach (ApplicationUser usr in users)
                {
                    await Clients.User(usr.Id).SendCoreAsync("ReceiveClosedChat", new[] { guid });
                }
            }

            return true;
        }
        public async Task<bool> DeleteConversation(string guid)
        {
            if (String.IsNullOrEmpty(guid))
                return false;
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return false;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null) return false;
            if (conversation.Creator != user) return false;

            conversation.Status = StatusConversation.closed;
            await _unitOfWork.ConversationRepository.UpdateAsync(conversation);

            IEnumerable<ApplicationUser> users = conversation.Participants.Select(part => part.User);
            foreach (ApplicationUser usr in users)
            {
                await Clients.User(usr.Id).SendCoreAsync("ReceiveClosedChat", new[] { guid });
            }

            return true;
        }
        public async Task<bool> CreateConversation(string title, IEnumerable<string> names)
        {
            //to check count names are received
            if (names.Count() == 0) return false;

            //to get current user
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return false;

            //to get users from DB
            IEnumerable<ApplicationUser> users = names.Select(name => _userManager.FindByNameAsync(name).Result);
            users = users.Where(usr => usr != null);

            //to check lenght users and name 
            if (users.Count() != names.Count()) return false;

            //Determine the type of conversation and check for correctness
            if (String.IsNullOrEmpty(title))
            {
                if (users.Count() != 1)
                {
                    return false;
                }
            }
            else
            {
                for (int i = 0; i < users.Count(); i++)
                    for (int j = 0; j < users.Count(); j++)
                    {
                        if (i == j) continue;
                        if (users.ElementAtOrDefault(i) == users.ElementAtOrDefault(j))
                            return false;
                    }
            }

            Conversation conversation = new Conversation()
            {
                Created = DateTime.Now,
                Creator = user,
                Guid = Guid.NewGuid().ToString(),
                Status = StatusConversation.opened,
                Title = string.IsNullOrEmpty(title) ? null : title,
                Updated = DateTime.Now
            };

            await _unitOfWork.ConversationRepository.CreateAsync(conversation);

            ConversationReturn conversationsReturn = new ConversationReturn()
            {
                Guid = conversation.Guid,
                Text = "",
                Image = users.Count() > 1 ? "avatars/default.jpg" : users.First().Avatar,
                Title = users.Count() > 1 ? title : users.First().FirstName + " " + users.First().LastName
            };

            //Add user's main as participant
            await _unitOfWork.ParticipantRepository.CreateAsync(new Participant()
            {
                Conversation = conversation,
                Type = TypeParticipant.administrator,
                User = user
            });
            await Clients.Caller.SendCoreAsync("ReceiveCreateChat", new[] { conversationsReturn });

            if(users.Count() == 1)
            {
                conversationsReturn.Title = user.FirstName + " " + user.LastName;
                conversationsReturn.Image = user.Avatar;
            }
            //Add other users
            foreach (var usr in users)
            {
                await _unitOfWork.ParticipantRepository.CreateAsync(new Participant()
                {
                    Conversation = conversation,
                    Type = TypeParticipant.user,
                    User = usr
                });

                await Clients.User(usr.Id).SendCoreAsync("ReceiveCreateChat", new[] { conversationsReturn });
            }

            return true;
        }
        public async Task<IEnumerable<string>> GetAllUsers()
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return null;

            return _userManager.Users.Where(usr => usr != user).Select(usr => usr.UserName);
        }
        public async Task SendMessage(string message, string guid)
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null || conversation.Status == StatusConversation.closed)
                return;

            Message msg = new Message()
            {
                Text = message,
                Sender = user,
                Created = DateTime.Now,
                Conversation = conversation
            };

            await _unitOfWork.MessageRepository.CreateAsync(msg);

            IEnumerable<ApplicationUser> users = conversation.Participants.Select(part => part.User);
            if (users.Count() > 0)
            {
                MessagesReturn messagesReturn = new MessagesReturn()
                {
                    Image = msg.Sender.Avatar,
                    MessageId = msg.MessageId,
                    Text = msg.Text,
                    Conversation = conversation.Guid
                };

                foreach (var usr in users)
                {
                    messagesReturn.IsMine = msg.Sender == usr;

                    await Clients.User(usr.Id).SendCoreAsync("ReceiveMessage", new[] { messagesReturn });
                }
            }
        }
        public async Task<ApplicationUser> GetProfile() => await _userManager.GetUserAsync(Context.User);
        public async Task<ChatConversationReturn> GetHistoryConversation(string guid)
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return null;

            var conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null)
                return null;

            var messages = conversation.Messages;
            var userConv = String.IsNullOrEmpty(conversation.Title) ? conversation.Participants.Single(p => p.User != user).User : null;
            
            ChatConversationReturn chatConversation = new ChatConversationReturn()
            {
                Title = userConv == null ? conversation.Title : userConv.FirstName + " " + userConv.LastName,
                Image = userConv == null ? "avatars/default.jpg" : userConv.Avatar,
                Group = userConv == null ? true : false,
                Status = conversation.Status,
                Creator = conversation.Creator == user,
                Participants = conversation.Creator == user && userConv == null ? conversation.Participants.Where(part => part.User != user).ToDictionary(part => part.User.Id, part => part.User.FirstName + " " + part.User.LastName) : null,
                Messages = messages.Select(msg => new MessagesReturn()
                {
                    MessageId = msg.MessageId,
                    Image = msg.Sender.Avatar,
                    Text = msg.Text,
                    IsMine = msg.Sender == user
                })
            };

            return chatConversation;
        }
        public async Task<IEnumerable<ConversationReturn>> GetConversations()
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return null;

            IEnumerable<Conversation> conversations = _unitOfWork.ParticipantRepository.GetAllConversationsByUser(user);
            if (conversations.Count() == 0)
                return null;

            IEnumerable<ConversationReturn> newConversations = conversations.Select(conversation =>
            {
                var userConv = (conversation.Title == null) ? conversation.Participants.Where(p => p.User != user).FirstOrDefault()?.User : null;
                var lastMessage = conversation.Messages.LastOrDefault();

                return new ConversationReturn()
                {
                    Guid = conversation.Guid,
                    Text = (user == lastMessage?.Sender ? "You: " : "") + lastMessage?.Text,
                    Image = (userConv == null) ? "avatars/default.jpg" : userConv.Avatar,
                    Title = (userConv == null) ? conversation.Title : userConv.FirstName + " " + userConv.LastName
                };
            });

            return newConversations;
        }
    }
}

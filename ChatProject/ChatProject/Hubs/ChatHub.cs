using ChatProject.Data;
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

        public async Task SendMessage(string message, string guid)
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return;

            Conversation conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null)
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
            foreach(var usr in users)
            {
                MessagesReturn messagesReturn = new MessagesReturn()
                {
                    isMe = msg.Sender == usr,
                    Image = msg.Sender.Avatar,
                    MessageId = msg.MessageId,
                    Text = msg.Text,
                    Conversation = conversation.Guid
                };
                await Clients.User(usr.Id).SendCoreAsync("ReceiveMessage", new[] { messagesReturn });
            }
        }
        public class MessagesReturn
        {
            public int MessageId { get; set; }
            public bool isMe { get; set; }
            public string Image { get; set; }
            public string Text { get; set; }
            public string Conversation { get; set; }
        }
        public async Task<IEnumerable<MessagesReturn>> GetMessages(string guid)
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return null;

            var messages = await _unitOfWork.ConversationRepository.GetMessagesByGuidAsync(guid);
            IEnumerable<MessagesReturn> newMessages = messages.Select(msg => new MessagesReturn()
            {
                MessageId = msg.MessageId,
                Image = msg.Sender.Avatar,
                Text = msg.Text,
                isMe = msg.Sender == user
            });
            return newMessages;
        }

        public async Task<ApplicationUser> GetProfile() => await _userManager.GetUserAsync(Context.User);
        public class ProfileReturn
        {
            public string Title { get; set; }
            public string Image { get; set; }
        }
        public async Task<ProfileReturn> GetContactProfile(string guid)
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return null;

            var conversation = await _unitOfWork.ConversationRepository.GetConversationByGuidAsync(guid);
            if (conversation == null)
                return null;

            var userConv = (conversation.Title == null) ? conversation.Participants.Where(p => p.User != user).Single().User : null;

            ProfileReturn profile = new ProfileReturn();

            profile.Title = (userConv == null) ? conversation.Title + " (" + conversation.Participants.Count() + ")" : userConv.FirstName + " " + userConv.LastName;
            profile.Image = (userConv == null) ? "avatars/default.jpg" : userConv.Avatar;

            return profile;
        }
        public class ConversationsReturn
        {
            public string Guid { get; set; }
            public string Text { get; set; }
            public string Title { get; set; }
            public string Image { get; set; }
        }
        public async Task<IEnumerable<ConversationsReturn>> GetConversations()
        {
            ApplicationUser user = await _userManager.GetUserAsync(Context.User);
            if (user == null)
                return null;

            IEnumerable<Conversation> conversations = _unitOfWork.ParticipantRepository.GetAllConversationsByUser(user);
            if (conversations.Count() == 0)
                return null;

            IEnumerable<ConversationsReturn> newConversations = conversations.Select(conversation =>
            {
                var userConv = (conversation.Title == null) ? conversation.Participants.Where(p => p.User != user).FirstOrDefault()?.User : null;
                var lastMessage = conversation.Messages.LastOrDefault();

                return new ConversationsReturn()
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

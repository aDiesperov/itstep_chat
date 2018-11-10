using ChatProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Hubs.Models
{
    public class ChatConversationReturn
    {
        public string Title { get; set; }
        public string Image { get; set; }
        public bool Group { get; set; }
        public StatusConversation Status { get; set; }
        public bool Creator { get; set; }
        public Dictionary<string, string> Participants { get; set; }
        public IEnumerable<MessagesReturn> Messages { get; set; }
    }
}

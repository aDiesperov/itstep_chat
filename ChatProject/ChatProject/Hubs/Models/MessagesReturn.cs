using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Hubs.Models
{
    public class MessagesReturn
    {
        public int MessageId { get; set; }
        public bool IsMine { get; set; }
        public string Image { get; set; }
        public string Text { get; set; }
        public string Conversation { get; set; }
    }
}

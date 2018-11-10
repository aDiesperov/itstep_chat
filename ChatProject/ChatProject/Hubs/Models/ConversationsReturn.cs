using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Hubs.Models
{
    public class ConversationReturn
    {
        public string Guid { get; set; }
        public string Text { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
    }
}

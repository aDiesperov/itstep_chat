using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Hubs.Models
{
    public class DeletedMessagesReturn
    {
        public string Conversation { get; set;}
        public IEnumerable<int> MessagesIds { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Models
{
    public class Conversation
    {
        public int ConversationId { get; set; }
        public string Title { get; set; }
        [Required]
        public virtual ApplicationUser Creator { get; set; }
        [Required]
        public string Guid { get; set; } = System.Guid.NewGuid().ToString();
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime Updated { get; set; } = DateTime.Now;
        public StatusConversation Status { get; set; } = StatusConversation.opened;
        public virtual IEnumerable<Participant> Participants { get; set; }
        public virtual IEnumerable<Message> Messages { get; set; }
    }
}

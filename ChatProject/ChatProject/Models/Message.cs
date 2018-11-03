using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        [Required]
        public virtual Conversation Conversation { get; set; }
        [Required]
        public virtual ApplicationUser Sender { get; set; }
        public string Text { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public virtual IEnumerable<Attachment> Attachments { get; set; }
    }
}

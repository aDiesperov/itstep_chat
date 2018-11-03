using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Models
{
    public class Participant
    {
        public int ParticipantId { get; set; }
        [Required]
        public virtual Conversation Conversation { get; set; }
        [Required]
        public virtual ApplicationUser User { get; set; }
        public TypeParticipant Type { get; set; } = TypeParticipant.user;
    }
}

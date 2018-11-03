using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Models
{
    public class Attachment
    {
        public int AttachmentId { get; set; }
        [Required]
        public virtual Message Message { get; set; }
        [Required]
        public string Location { get; set; }
    }
}

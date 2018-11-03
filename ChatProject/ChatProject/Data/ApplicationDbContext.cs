using System;
using System.Collections.Generic;
using System.Text;
using ChatProject.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatProject.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
           
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Message>().HasOne(m => m.Sender).WithMany().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Participant>().HasOne(p => p.User).WithMany().OnDelete(DeleteBehavior.Restrict);
        }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Participant> Participants { get; set; }
    }
}

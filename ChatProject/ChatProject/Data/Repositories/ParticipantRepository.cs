using ChatProject.Data.Interfaces;
using ChatProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Data.Repositories
{
    public class ParticipantRepository : Repository<Participant>, IParticipantRepository
    {
        public ParticipantRepository(ApplicationDbContext context) : base(context) { }

        public IEnumerable<Conversation> GetAllConversationsByUser(ApplicationUser user) => 
            GetAll()
            .Where(part => part.User == user)
            .Select(part => part.Conversation);
    }
}

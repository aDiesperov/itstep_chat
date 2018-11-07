using ChatProject.Data.Interfaces;
using ChatProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Data.Repositories
{
    public class ConversationRepository : Repository<Conversation>, IConversationRepository
    {
        public ConversationRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Conversation> GetConversationByGuidAsync(string guid) =>
            await GetAll().SingleOrDefaultAsync(conversation => conversation.Guid == guid);

        public async Task<IEnumerable<Message>> GetMessagesByGuidAsync(string guid)
        {
            Conversation conversation = await GetAll().SingleOrDefaultAsync(c => c.Guid == guid);
            return conversation.Messages;
        }
    }
}

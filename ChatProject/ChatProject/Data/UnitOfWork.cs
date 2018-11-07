using ChatProject.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Data
{
    public class UnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private AttachmentRepository _attachmentRepository;
        private MessageRepository _messageRepository;
        private ConversationRepository _conversationRepository;
        private ParticipantRepository _participantRepository;

        public UnitOfWork(ApplicationDbContext context) => _context = context;

        public AttachmentRepository AttachmentRepository
        {
            get
            {
                if (_attachmentRepository == null) _attachmentRepository = new AttachmentRepository(_context);
                return _attachmentRepository;
            }
        }
        public MessageRepository MessageRepository
        {
            get
            {
                if (_messageRepository == null) _messageRepository = new MessageRepository(_context);
                return _messageRepository;
            }
        }
        public ConversationRepository ConversationRepository
        {
            get
            {
                if (_conversationRepository == null) _conversationRepository = new ConversationRepository(_context);
                return _conversationRepository;
            }
        }
        public ParticipantRepository ParticipantRepository
        {
            get
            {
                if (_participantRepository == null) _participantRepository = new ParticipantRepository(_context);
                return _participantRepository;
            }
        }
    }
}

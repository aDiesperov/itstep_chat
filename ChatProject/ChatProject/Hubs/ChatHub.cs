using ChatProject.Data;
using ChatProject.Hubs.Models;
using ChatProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatProject.Hubs
{
    public class ChatHub : Hub
    {
        public ChatHub(UnitOfWork unitOfWork, UserManager<ApplicationUser> userManager){}
        
    }
}

using System;
using System.Linq;
using System.Threading.Tasks;
using ChatProject.Data;
using ChatProject.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace ChatProject
{
    public class DbInitializer
    {
        public static async Task Initialize(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var _userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var _unitOfWork = serviceScope.ServiceProvider.GetRequiredService<UnitOfWork>();

                if (_userManager.Users.Count() == 0)
                {
                    ApplicationUser user1 = new ApplicationUser()
                    {
                        UserName = "userr",
                        Email = "userr@mail.ru",
                        FirstName = "Anatoly",
                        LastName = "Diesperov",
                        MiddleName = "Valeryivich",
                        Avatar = "avatars/default.jpg"
                    };
                    await _userManager.CreateAsync(user1, "123456q");

                    ApplicationUser user2 = new ApplicationUser()
                    {
                        UserName = "Justeen",
                        Email = "Justeen@mail.ru",
                        FirstName = "Justeen",
                        LastName = "Mike",
                        MiddleName = "Stone",
                        Avatar = "avatars/default.jpg"
                    };
                    await _userManager.CreateAsync(user2, "123456q");

                    ApplicationUser user3 = new ApplicationUser()
                    {
                        UserName = "Christian",
                        Email = "Christian@mail.ru",
                        FirstName = "Christian",
                        LastName = "Trelawney",
                        MiddleName = "Valeryivich",
                        Avatar = "avatars/default.jpg"
                    };
                    await _userManager.CreateAsync(user3, "123456q");

                    Conversation conversation = new Conversation()
                    {
                        Created = DateTime.Now,
                        Updated = DateTime.Now,
                        Creator = user1,
                        Guid = Guid.NewGuid().ToString(), //check equils guid
                        Status = StatusConversation.opened,
                        Participants = new Participant[]{
                            new Participant() {
                                Type = TypeParticipant.user,
                                User = user1
                            },
                            new Participant() {
                                Type = TypeParticipant.user,
                                User = user2
                            }
                        },
                        Messages = new Message[]
                        {
                            new Message()
                            {
                                Created = DateTime.Now,
                                Sender = user1,
                                Text = "Message from user 1"
                            },
                            new Message()
                            {
                                Created = DateTime.Now,
                                Sender = user2,
                                Text = "Message from user 2"
                            }
                        }
                    };
                    await _unitOfWork.ConversationRepository.CreateAsync(conversation);

                    conversation = new Conversation()
                    {
                        Created = DateTime.Now,
                        Updated = DateTime.Now,
                        Creator = user1,
                        Title = "Some group",
                        Guid = Guid.NewGuid().ToString(), //check equils guid
                        Status = StatusConversation.opened,
                        Participants = new Participant[]{
                            new Participant() {
                                Type = TypeParticipant.administrator,
                                User = user1
                            },
                            new Participant() {
                                Type = TypeParticipant.user,
                                User = user2
                            },
                            new Participant() {
                                Type = TypeParticipant.user,
                                User = user3
                            }
                        },
                        Messages = new Message[]
                        {
                            new Message()
                            {
                                Created = DateTime.Now,
                                Sender = user1,
                                Text = "Message from user 1"
                            },
                            new Message()
                            {
                                Created = DateTime.Now,
                                Sender = user2,
                                Text = "Message from user 2"
                            },
                            new Message()
                            {
                                Created = DateTime.Now,
                                Sender = user3,
                                Text = "Message from user 3"
                            }
                        }
                    };
                    await _unitOfWork.ConversationRepository.CreateAsync(conversation);

                }
            }
        }
    }
}
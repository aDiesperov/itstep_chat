using System;
using System.Linq;
using System.Threading.Tasks;
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

                if (_userManager.Users.Count() == 0)
                {
                    ApplicationUser user = new ApplicationUser()
                    {
                        UserName = "userr",
                        Email = "userr@mail.ru",
                        FirstName = "Anatoly",
                        LastName = "Diesperov",
                        MiddleName = "Valeryivich"
                    };
                    await _userManager.CreateAsync(user, "123456q");
                }
            }
        }
    }
}
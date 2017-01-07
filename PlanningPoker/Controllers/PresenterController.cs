using System;
using System.Text;
using System.Web.Mvc;

namespace PlanningPoker.Controllers
{
    public class PresenterController : Controller
    {
        private Random Rand = new Random();

        public ActionResult Index()
        {
            
            return RedirectToAction("Room", new { id = GenerateRoomId() });
        }

        public ActionResult Room(string id)
        {
            HttpContext.Application["LastRoomId"] = id;
            return View((object)id);
        }

        private string GenerateRoomId()
        {
            string validCharacters = "abcdefghijkmnpqrstuxyz23456789";
            StringBuilder result = new StringBuilder();
            for (var i = 0; i < 4; i++)
            {
                result.Append(validCharacters[Rand.Next(0, validCharacters.Length - 1)]);
            }
            return result.ToString();
        }
    }
}
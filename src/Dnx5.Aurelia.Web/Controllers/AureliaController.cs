using Microsoft.AspNet.Mvc;

namespace Dnx5.Aurelia.Web.Controllers
{
	public class AureliaController : Controller
	{
		// GET: /<controller>/
		public IActionResult Index()
		{
			return View();
		}
	}
}
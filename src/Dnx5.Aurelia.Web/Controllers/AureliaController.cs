using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;

namespace Dnx5.Aurelia.Web.Controllers
{
	public class AureliaController : Controller
	{
		private readonly IOptions<AppSettings> _appSettings;

		public AureliaController(IOptions<AppSettings> appSettings)
		{
			_appSettings = appSettings;
			if (appSettings == null)
			{
				
			}
		}

		// GET: /<controller>/
		public IActionResult Index()
		{
			if(_appSettings == null) {}

			return View();
		}
	}
}
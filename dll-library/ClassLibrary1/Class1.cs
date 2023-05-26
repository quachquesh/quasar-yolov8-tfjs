using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1
{
    public class Class1
    {
        public async Task<object> Test(object input)
        {
            string message = (string)input;
            return String.Format("[Func DLL] Build On {0}, you said {1}",
              System.DateTime.Now,
              message);
        }
    }
}

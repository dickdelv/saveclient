using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace saveclient.Models
{
    public class Persona
    {
        public int Id { get; set; }
        public int Cedula { get; set; }
        public string Nombre { get; set; }
        public int Telefono { get; set; }
        public string Correo { get; set; }
    }
}
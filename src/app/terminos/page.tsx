"use client";

import { ScrollText } from "lucide-react";

export default function TerminosPage() {
  const lastUpdated = "1 de marzo de 2024";

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ScrollText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Terminos y Condiciones</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ultima actualizacion: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {/* Introduccion */}
            <div className="rounded-lg border bg-muted/30 p-6">
              <p className="m-0 text-muted-foreground">
                Bienvenido a EventosPro. Al acceder y utilizar nuestra plataforma, aceptas estos 
                terminos y condiciones en su totalidad. Te recomendamos leerlos detenidamente antes 
                de utilizar nuestros servicios.
              </p>
            </div>

            {/* Seccion 1 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">1. Definiciones</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Plataforma:</strong> Se refiere al sitio web, 
                  aplicaciones moviles y cualquier otro medio digital operado por EventosPro.
                </p>
                <p>
                  <strong className="text-foreground">Usuario:</strong> Toda persona que acceda, 
                  navegue o utilice los servicios de la Plataforma.
                </p>
                <p>
                  <strong className="text-foreground">Organizador:</strong> Persona fisica o juridica 
                  que utiliza la Plataforma para promocionar y vender entradas a eventos.
                </p>
                <p>
                  <strong className="text-foreground">Comprador:</strong> Usuario que adquiere entradas 
                  a traves de la Plataforma.
                </p>
                <p>
                  <strong className="text-foreground">Entrada:</strong> Documento digital o fisico que 
                  otorga derecho de acceso a un evento.
                </p>
              </div>
            </div>

            {/* Seccion 2 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">2. Uso de la Plataforma</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  2.1. Para utilizar ciertos servicios de la Plataforma, deberas crear una cuenta 
                  proporcionando informacion veraz, completa y actualizada.
                </p>
                <p>
                  2.2. Eres responsable de mantener la confidencialidad de tus credenciales de acceso 
                  y de todas las actividades que ocurran bajo tu cuenta.
                </p>
                <p>
                  2.3. Te comprometes a no utilizar la Plataforma para fines ilegales o no autorizados.
                </p>
                <p>
                  2.4. Nos reservamos el derecho de suspender o cancelar tu cuenta si detectamos 
                  actividades fraudulentas o violaciones a estos terminos.
                </p>
              </div>
            </div>

            {/* Seccion 3 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">3. Compra de Entradas</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  3.1. Al realizar una compra, aceptas pagar el precio indicado mas los cargos por 
                  servicio aplicables.
                </p>
                <p>
                  3.2. Las entradas estan sujetas a disponibilidad. La confirmacion de compra se 
                  enviara a tu correo electronico registrado.
                </p>
                <p>
                  3.3. Es tu responsabilidad verificar los detalles del evento (fecha, hora, lugar) 
                  antes de completar la compra.
                </p>
                <p>
                  3.4. Las entradas son personales e intransferibles, salvo que el Organizador 
                  indique lo contrario.
                </p>
              </div>
            </div>

            {/* Seccion 4 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">4. Politica de Reembolsos</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  4.1. <strong className="text-foreground">Cancelacion por el Organizador:</strong> Si 
                  un evento es cancelado, recibiras un reembolso completo del precio de la entrada.
                </p>
                <p>
                  4.2. <strong className="text-foreground">Cambio de fecha:</strong> Si un evento 
                  cambia de fecha, tu entrada sera valida para la nueva fecha. Si no puedes asistir, 
                  podras solicitar reembolso dentro de los 7 dias siguientes al anuncio.
                </p>
                <p>
                  4.3. <strong className="text-foreground">Cambio de lugar:</strong> Aplican las 
                  mismas condiciones que para el cambio de fecha.
                </p>
                <p>
                  4.4. <strong className="text-foreground">Cancelacion por el Comprador:</strong> Las 
                  entradas generalmente no son reembolsables, salvo que el Organizador lo permita 
                  expresamente.
                </p>
                <p>
                  4.5. Los cargos por servicio no son reembolsables en ningun caso.
                </p>
              </div>
            </div>

            {/* Seccion 5 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">5. Responsabilidades del Organizador</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  5.1. El Organizador es el unico responsable del evento, incluyendo su realizacion, 
                  calidad, seguridad y cumplimiento con las leyes aplicables.
                </p>
                <p>
                  5.2. EventosPro actua unicamente como intermediario entre el Organizador y el 
                  Comprador.
                </p>
                <p>
                  5.3. El Organizador se compromete a proporcionar informacion veraz sobre el evento 
                  y a cumplir con los compromisos adquiridos con los Compradores.
                </p>
              </div>
            </div>

            {/* Seccion 6 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">6. Propiedad Intelectual</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  6.1. Todo el contenido de la Plataforma, incluyendo textos, graficos, logos, 
                  iconos, imagenes y software, es propiedad de EventosPro o sus licenciantes.
                </p>
                <p>
                  6.2. No esta permitido copiar, reproducir, distribuir o crear obras derivadas sin 
                  autorizacion expresa por escrito.
                </p>
              </div>
            </div>

            {/* Seccion 7 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">7. Privacidad y Proteccion de Datos</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  7.1. El tratamiento de tus datos personales se rige por nuestra Politica de 
                  Privacidad, la cual forma parte integral de estos Terminos.
                </p>
                <p>
                  7.2. Al utilizar la Plataforma, consientes el tratamiento de tus datos conforme 
                  a dicha politica.
                </p>
              </div>
            </div>

            {/* Seccion 8 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">8. Limitacion de Responsabilidad</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  8.1. EventosPro no sera responsable por danos directos, indirectos, incidentales, 
                  especiales o consecuentes derivados del uso de la Plataforma.
                </p>
                <p>
                  8.2. No garantizamos que la Plataforma estara libre de errores o funcionara sin 
                  interrupciones.
                </p>
                <p>
                  8.3. Nuestra responsabilidad maxima se limita al monto pagado por el Usuario en 
                  los ultimos 12 meses.
                </p>
              </div>
            </div>

            {/* Seccion 9 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">9. Modificaciones</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  9.1. Nos reservamos el derecho de modificar estos Terminos en cualquier momento.
                </p>
                <p>
                  9.2. Las modificaciones entraran en vigor desde su publicacion en la Plataforma.
                </p>
                <p>
                  9.3. El uso continuado de la Plataforma despues de cualquier modificacion 
                  constituye tu aceptacion de los nuevos Terminos.
                </p>
              </div>
            </div>

            {/* Seccion 10 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">10. Ley Aplicable y Jurisdiccion</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  10.1. Estos Terminos se rigen por las leyes de la Republica de Colombia.
                </p>
                <p>
                  10.2. Cualquier disputa sera sometida a los tribunales competentes de la ciudad 
                  de Bogota, Colombia.
                </p>
              </div>
            </div>

            {/* Seccion 11 */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">11. Contacto</h2>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <p>
                  Si tienes preguntas sobre estos Terminos y Condiciones, puedes contactarnos a traves de:
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>Correo electronico: legal@eventospro.com</li>
                  <li>Telefono: +57 (1) 234-5678</li>
                  <li>Direccion: Calle 100 #15-20, Oficina 501, Bogota, Colombia</li>
                </ul>
              </div>
            </div>

            {/* Nota final */}
            <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6">
              <p className="m-0 text-sm text-muted-foreground">
                <strong className="text-foreground">Nota importante:</strong> Este documento 
                constituye un acuerdo legal vinculante entre tu y EventosPro. Al utilizar nuestros 
                servicios, confirmas que has leido, entendido y aceptado estos terminos en su 
                totalidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

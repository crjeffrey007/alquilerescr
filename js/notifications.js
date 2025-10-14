// js/notifications.js - EmailJS helpers. Replace SERVICE_ID, TEMPLATE_ID and PUBLIC_KEY
(function(){
  if(window.emailjs){
    emailjs.init("TU_PUBLIC_KEY_EMAILJS");
  }
})();
async function notifyAdmin(serviceId, templateId, params){
  try{
    if(window.emailjs){
      await emailjs.send(serviceId, templateId, params);
    } else {
      console.log("EmailJS no iniciado. Datos:", params);
    }
  }catch(e){
    console.error("Error enviando EmailJS",e);
  }
}

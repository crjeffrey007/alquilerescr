<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'path/to/PHPMailer/src/Exception.php';
require 'path/to/PHPMailer/src/PHPMailer.php';
require 'path/to/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $field_first_name = $_POST['contact_names'];
    $field_subject = $_POST['contact_subject'];
    $field_email = $_POST['contact_email'];
    $field_phone = $_POST['contact_phone'];
    $field_message = $_POST['contact_message'];

    // Configuración de PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.brevo.com'; // Cambia esto por la configuración correcta de Brevo
    $mail->SMTPAuth = true;
    $mail->Username = 'crjeffrey7@gmail.com'; // Reemplaza con tu usuario SMTP
    $mail->Password = 'KW6p4Gdbx72M5H9n'; // Reemplaza con tu clave SMTP
    $mail->SMTPSecure = 'tls'; // O 'ssl' dependiendo de la configuración de Brevo
    $mail->Port = 587; // O el puerto que esté configurado en Brevo

    $mail->setFrom($field_email, $field_first_name);
    $mail->addAddress('to@email.com'); // Reemplaza con tu dirección de correo electrónico real

    $mail->Subject = 'Mensaje de un visitante del sitio: '.$field_first_name;
    $mail->Body = 'De: '.$field_first_name."\n".
                  'Asunto: '.$field_subject."\n".
                  'Correo Electrónico: '.$field_email."\n".
                  'Número de Teléfono: '.$field_phone."\n".
                  'Mensaje: '.$field_message;

    try {
        $mail->send();
        ?>
        <script language="javascript" type="text/javascript">
            alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
            window.location = 'index.html';
        </script>
        <?php
    } catch (Exception $e) {
        ?>
        <script language="javascript" type="text/javascript">
            alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
            window.location = 'index.html';
        </script>
        <?php
    }
}
?>

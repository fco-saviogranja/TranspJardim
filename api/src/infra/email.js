const nodemailer = require('nodemailer');

/**
 * Cria (ou retorna) um transporter SMTP reutilizável.
 *
 * Variáveis esperadas no config.smtp:
 *   host, port, user, pass, from
 */
let _transporter = null;

function getTransporter(smtp) {
  if (_transporter) return _transporter;

  if (!smtp.host || !smtp.user || !smtp.pass) {
    throw Object.assign(
      new Error('SMTP não configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS nas variáveis de ambiente.'),
      { statusCode: 503 },
    );
  }

  _transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,          // true para 465, false para 587
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: { rejectUnauthorized: false },  // Hostinger pode usar cert auto-assinado
  });

  return _transporter;
}

/**
 * Envia um e-mail.
 *
 * @param {object}  smtp           Config SMTP (host, port, user, pass, from)
 * @param {object}  opts
 * @param {string}  opts.to        Destinatário(s), separados por vírgula
 * @param {string}  opts.subject   Assunto
 * @param {string}  [opts.text]    Corpo texto puro
 * @param {string}  [opts.html]    Corpo HTML (opcional)
 * @returns {Promise<object>}      Resultado do nodemailer (messageId, accepted, etc.)
 */
async function sendEmail(smtp, { to, subject, text, html }) {
  if (!to || !subject) {
    throw Object.assign(
      new Error('Campos "to" e "subject" são obrigatórios.'),
      { statusCode: 400 },
    );
  }

  const transporter = getTransporter(smtp);

  const info = await transporter.sendMail({
    from: smtp.from || smtp.user,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
}

/**
 * Reseta o transporter (útil em testes).
 */
function resetTransporter() {
  _transporter = null;
}

module.exports = { sendEmail, resetTransporter };

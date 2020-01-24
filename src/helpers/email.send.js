module.exports = app => async function emailSend(data) {
    let MailJet = (await
        import ('node-mailjet')).default
    var mailjet = MailJet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY, {
        version: 'v3.1'
    });
    const mailjet_request = {
        Messages: [{
            From: {
                Email: process.env.APP_WEBMASTER || "webmaster@misitioba.com",
                Name: process.env.APP_NAME || "MisitioBA"
            },
            To: [{
                Email: data.to.email,
                Name: data.to.name
            }],
            TemplateID: MAILJET_TEMPLATES.ACCOUNT_REGISTERED,
            TemplateLanguage: true,
            Variables: data.variables,
        }]
    }
    const mailjet_response = await mailjet
        .post("send")
        .request(mailjet_request)
    return mailjet_response;
}
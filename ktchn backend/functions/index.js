const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

var nodeoutlook = require('nodejs-nodemailer-outlook');

exports.contactedEmailForward = functions.firestore.document('contact/{contactID}').onCreate((snap, context) => {
    const application = snap.data().application;
    const email = snap.data().email;
    const subject = snap.data().subject;
    const message = snap.data().message;
    const date = snap.data().date;

    const text = `
        Website Contact Recieved:

        Applying for Chef = ${application},
        Email = ${email},
        Subject = ${subject},
        Message = ${message}
    `

    return nodeoutlook.sendEmail({
        auth: {
            user: 'support@ktchnonline.com',
            pass: 'KTCHN2021'
            },
        from: '"Ktchn App" support@ktchnonline.com',
        to: 'support@ktchnonline.com',
        subject: 'Website Contact Recieved',
        text: text,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
    });

})

exports.recipeReccomended = functions.https.onCall((data, context) => {
    const recipeId = data.recipeId;
    const updatedScore = data.updatedScore;
    
    return db.collection('recipes').doc(recipeId).set({
        reccomendations: updatedScore
    }, { merge: true })
})


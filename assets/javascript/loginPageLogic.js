
//On window load or document ready
window.onload = function () {

    //initiate the application
    initApp();
};


function initApp() {   


    //firebase configuration for the DayDahsboard Web app
    var firebaseConfig = {
        apiKey: "AIzaSyB0L_zmqWF5nPq7AjgyOuh6LvMMBPpltz8",
        authDomain: "daydashboard.firebaseapp.com",
        databaseURL: "https://daydashboard.firebaseio.com",
        projectId: "daydashboard",
        storageBucket: "daydashboard.appspot.com",
        messagingSenderId: "601335236816",
        appId: "1:601335236816:web:d14de5c8167c18efb676d5"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    //create local database variable for firebase database
    var database = firebase.database();

    //sign out if any uer logged in
    firebase.auth().signOut();

    //this function resets all fields on both
    //login and registration forms to empty initially
    var resetLoginAndRegisterFields = function() {
        //clear all the fields
        $("#registerInfoMsg").text("");
        $("#loginInfoMsg").text("");
        $('#registerUserName').val("");
        $('#registerEmail').val("");
        $('#registerPswd').val("");
        $('#loginEmail').val("");
        $('#loginPswd').val("");

    }

    //initially clear all the fields on login and registration forms
    //hide login info 
    //and display login form to the user 
    resetLoginAndRegisterFields();
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');    

    //event handler when user chooses login or register radio button
    $('.login-reg-panel input[type="radio"]').on('change', function () {

        //if user chooses login radio button, display login form
        if ($('#log-login-show').is(':checked')) {

            //clear all fields initially
            resetLoginAndRegisterFields();

            //hide register informations and show login informations
            $('.register-info-box').fadeOut();
            $('.login-info-box').fadeIn();

            // display login form and hide registration form
            $('.white-panel').addClass('right-log');
            $('.register-show').addClass('show-log-panel');
            $('.login-show').removeClass('show-log-panel');

        }

        // else if user chooses register radio button, display registration form
        else if ($('#log-reg-show').is(':checked')) {

            //clear all fields initially
            resetLoginAndRegisterFields();

            //hide login informations and show registration informations
            $('.register-info-box').fadeIn();
            $('.login-info-box').fadeOut();

            // display registartion form and hide login form
            $('.white-panel').removeClass('right-log');
            $('.login-show').addClass('show-log-panel');
            $('.register-show').removeClass('show-log-panel');
        }
    });


    // Listening for auth state changes.    
    firebase.auth().onAuthStateChanged(function (user) {

        document.getElementById('login').addEventListener('click', SignIn, false);
        document.getElementById('register').addEventListener('click', handleSignUp, false);

    });

    //event call back method on sign up
    function handleSignUp() {

        //fetch the input values like name,email and pswd
        var userName = document.getElementById('registerUserName').value;
        var email = document.getElementById('registerEmail').value;
        var password = document.getElementById('registerPswd').value;

        if (email.length < 4) {
            $("#registerInfoMsg").css("color", "red").text('**Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            $("#registerInfoMsg").css("color", "red").text('**Please enter a password.');
            return;
        }

        // Sign in with email and pass.
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {

                //user succesfully created with given email and pswd
                if (firebase.auth().currentUser) {
                    firebase.auth().currentUser.updateProfile({
                        displayName: userName,
                    }).then(function () {

                        //user displayname is updated succesfully                        
                        $("#registerInfoMsg").css("color", "green").text('Succesfully Registered');

                        //reset the fields
                        $('#registerUserName').val("");
                        $('#registerEmail').val("");
                        $('#registerPswd').val("");

                        //add the user to the database with email as root
                        var emailmodified = email.replace("@", "atrateof");
                        var emailmodified1 = emailmodified.replace(".", "dot");
                        fireUpdate(userName, emailmodified1);
                    }).catch(function (error) {
                        //user display name is failed or the user is not added to database
                        $("#registerInfoMsg").css("color", "red").text("**" + error);
                    });
                }
            }).catch(function (error) {
                // Handle registration Errors here of failing registering the user.
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/weak-password') {
                    $("#registerInfoMsg").css("color", "red").text('**The password is too weak.');
                } else {
                    $("#registerInfoMsg").css("color", "red").text("**" + errorMessage);
                }

            });

    }

    //cretae the user in real database for future transactions on this uer
    function fireUpdate(email, name) {
        //create the user record at root/users in firebase database
        var userInputRef = database.ref("users/" + email + "/");
        userInputRef.set({
            userName: name,
        })
    };

    //event call back method on sign up
    function SignIn() {

        //fetch the input values
        var email = document.getElementById('loginEmail').value;
        var password = document.getElementById('loginPswd').value;

        if (email.length < 4) {
            $("#loginInfoMsg").css("color", "red").text("**Please enter an email address.");
            return;
        }
        if (password.length < 4) {
            $("#loginInfoMsg").css("color", "red").text("**Please enter a password.");
            return;
        }

        // Sign in with email and pass.
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (user) {

                //user suuccesfully logged in
                if (user) {

                    //add the user name and email to session
                    var name = user.user.displayName;
                    sessionStorage.clear();
                    sessionStorage.setItem("name", name);
                    sessionStorage.setItem("email", email);
                    var emailmodified = email.replace("@", "atrateof");
                    var emailmodified1 = emailmodified.replace(".", "dot");
                    sessionStorage.setItem("userAddedEmail", emailmodified1);

                    //redirect the window to user dashboard
                    window.location.replace("dashboard.html");
                }
            }).catch(function (error) {

                // Handle Errors here on signin failures
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    $("#loginInfoMsg").css("color", "red").text("**Wrong Password");
                } else {
                    $("#loginInfoMsg").css("color", "red").text("**" + errorMessage);
                }
            });
    }

    //google authentication sign in handler
    function onSignIn(googleUser) {

        console.log('Google Auth Response', googleUser);

        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                // [START googlecredential]
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);
                // [END googlecredential]

                // Sign in with credential from the Google user.
                // [START authwithcred]
                firebase.auth().signInWithCredential(credential).then(function (user) {
                    if (user) {
                        console.log("succesful log in");
                        console.log(user.user.displayName);

                        //var name = user.user.displayName;
                        // var email=user.user.email;                    
                        // sessionStorage.clear();
                        // sessionStorage.setItem("name", name);
                        // sessionStorage.setItem("email", email);

                        window.location.replace("dashboard.html");
                    }
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // [START_EXCLUDE]
                    if (errorCode === 'auth/account-exists-with-different-credential') {
                        $("#loginInfoMsg").css("color", "red").text('**You have already signed up with a different auth provider for that email.');
                    } else {
                        console.error(error);
                        $("#loginInfoMsg").css("color", "red").text("**" + errorMessage);
                    }
                    // [END_EXCLUDE]
                });
                // [END authwithcred]
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    }

    //check if the google authenticated user is already in firebase
    function isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

} //end of initapp method


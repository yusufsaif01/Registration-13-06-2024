const Promise = require("bluebird");
const errors = require("../errors");
const LoginUtility = require('../db/utilities/LoginUtility');
const PlayerUtility = require('../db/utilities/PlayerUtility')
const ClubAcademyUtility = require('../db/utilities/ClubAcademyUtility');
const UserService = require("./UserService");
const uuid = require('uuid/v4');
const AuthUtility = require('../db/utilities/AuthUtility');
const EmailService = require('./EmailService');
const config = require("../config");

/**
 *
 *
 * @class UserRegistrationService
 * @extends {UserService}
 */
class UserRegistrationService extends UserService {

    /**
     *Creates an instance of UserRegistrationService.
     * @memberof UserRegistrationService
     */
    constructor() {
        super();
        this.playerUtilityInst = new PlayerUtility();
        this.clubAcademyUtilityInst = new ClubAcademyUtility();
        this.loginUtilityInst = new LoginUtility();
        this.authUtilityInst = new AuthUtility();
        this.emailService = new EmailService();
    }

    /**
     *
     *
     * @param {*} registerUser
     * @returns
     * @memberof UserRegistrationService
     */
    validateMemberRegistration(registerUser) {
        if (registerUser.member_type == "player") {
            if (!registerUser.first_name) {
                return Promise.reject(new errors.ValidationFailed(
                    "first_name is required", { field_name: "first_name" }
                ));
            }
            if (!registerUser.last_name) {
                return Promise.reject(new errors.ValidationFailed(
                    "last_name is required", { field_name: "last_name" }
                ));
            }
        } else {
            if (!registerUser.name) {
                return Promise.reject(new errors.ValidationFailed(
                    "name is required", { field_name: "name" }
                ));
            }
        }
        return Promise.resolve(registerUser);
    }

    /**
     *
     *
     * @param {*} userData
     * @returns
     * @memberof UserRegistrationService
     */
    async memberRegistration(userData) {
        try {
            await this.validateMemberRegistration(userData);
            userData.user_id = uuid();

            await this.loginUtilityInst.insert({
                user_id: userData.user_id,
                username: userData.email,
                status: 'pending',
                role: userData.member_type,
                member_type: userData.member_type
            });

            if (userData.member_type == 'player') {
                await this.playerUtilityInst.insert(userData);
            } else {
                await this.clubAcademyUtilityInst.insert(userData);
            }
            const tokenForAccountActivation = await this.authUtilityInst.getAuthToken(userData.user_id, userData.email, userData.member_type);
            let accountActivationURL = config.app.baseURL + "create-password?token=" + tokenForAccountActivation;
            this.emailService.emailVerification(userData.email, accountActivationURL);
            return Promise.resolve();
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    /**
     *
     *
     * @param {*}
     * 
     * @returns
     * @memberof UserRegistrationService
     */
    toAPIResponse({ user_id, name, dob, role, email, avatar_url, state, country, phone, token,
        status, first_name, last_name, member_type, registration_number, is_email_verified
    }) {
        return {
            user_id, name, dob, role, email, token, avatar_url, first_name, last_name, member_type,
            registration_number, state, country, phone, status, is_email_verified
        };
    }
}

module.exports = UserRegistrationService;
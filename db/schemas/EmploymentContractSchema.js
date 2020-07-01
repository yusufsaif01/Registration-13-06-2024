const Role = require("../../constants/Role");
const uuidv4 = require("uuid/v4");
const contractStatus = require("../../constants/ContractStatus");
module.exports = {
  fields: {
    id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return uuidv4();
      },
    },
    status: {
      type: String,
      enum: [
        contractStatus.ACTIVE,
        contractStatus.COMPLETED,
        contractStatus.PENDING,
        contractStatus.YET_TO_START,
        contractStatus.DISAPPROVED,
        contractStatus.REJECTED,
      ],
    },
    send_to: {
      type: String,
    },
    sent_by: {
      type: String,
    },
    playerName: String,
    category: {
      type: String,
      enum: [Role.CLUB, Role.ACADEMY],
    },

    clubAcademyName: String,
    signingDate: Date,
    effectiveDate: Date,
    expiryDate: Date,
    placeOfSignature: String,
    clubAcademyRepresentativeName: String,
    clubAcademyAddress: String,
    clubAcademyPhoneNumber: String,
    clubAcademyEmail: String,
    aiffNumber: String,
    crsUserName: String,

    legalGuardianName: String,
    playerAddress: String,
    playerMobileNumber: String,
    playerEmail: String,

    clubAcademyUsesAgentServices: {
      type: Boolean,
      default: false,
    },
    clubAcademyIntermediaryName: String,
    clubAcademyTransferFee: String,

    playerUsesAgentServices: {
      type: Boolean,
      default: false,
    },
    playerIntermediaryName: String,
    playerTransferFee: String,

    otherName: String,
    otherEmail: String,
    otherPhoneNumber: String,

    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  schemaName: "employment_contract",
  options: {
    timestamps: true,
  },
};
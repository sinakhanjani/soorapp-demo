const axios = require('axios');
const Moment = require('moment');
const {
  smsPanelConfig: {
    secretKey, userApiKey, templateId, sendingNumber,
  },
} = require('../../config/config');

class SMSHelper {
  constructor(config) {
    if (typeof config.secretKey !== 'string') {
      throw new Error('secret key must be a string');
    }
    if (typeof config.userApiKey !== 'string') {
      throw new Error('user api key must be a string');
    }
    if (Number.isNaN(Number(config.templateId))) {
      throw new Error('template Id must be a string containing a number');
    }

    this.secretKey = config.secretKey;
    this.userApiKey = config.userApiKey;
    this.templateId = config.templateId;
    this.getTokenURL = 'http://restfulsms.com/api/Token';
    this.sendCodeURL = 'http://restfulsms.com/api/UltraFastSend';
    this.getCreditURL = 'https://restfulsms.com/api/credit';
    this.getSendURL = 'http://restfulsms.com/api/MessageSend';
    this.sendingNumber = sendingNumber;
    this.token = '';
    this.lastTokenIssued = 0;
    this.tokenValidTime = 29 * 60000; // minutes * milliseconds in a minute
  }

  async getToken() {
    const now = new Date();

    // token valid time is 30 minutes. if the token is expired we get a new one
    if (((now - this.lastTokenIssued) < this.tokenValidTime) && this.token) {
      return this.token;
    }

    const res = await axios.post(this.getTokenURL, {
      UserApiKey: this.userApiKey,
      SecretKey: this.secretKey,
    });

    if (!res.data.IsSuccessful) { throw new Error(res.data.Message); }

    this.token = res.data.TokenKey;
    this.lastTokenIssued = new Date();
  }

  async sendRegCode(mobile, code) {
    await this.getToken();

    const res = await axios.post(this.sendCodeURL, {
      Mobile: mobile,
      TemplateId: this.templateId,
      ParameterArray: [
        {
          Parameter: 'VerificationCode',
          ParameterValue: code,
        },
      ],
    }, {
      headers: { 'x-sms-ir-secure-token': this.token },
    });

    if (!res.data.IsSuccessful) {
      console.log(res.data);
      throw new Error(res.data.Message);
    }
  }

  async getCredit() {
    await this.getToken();

    const res = await axios.get(this.getCreditURL, {
      headers: { 'x-sms-ir-secure-token': this.token },
    });

    if (!res.data.IsSuccessful) {
      console.log(res.data);
      throw new Error(res.data.Message);
    }
    return res.data.Credit;
  }

  async send(message, mobiles) {
    if (!Array.isArray(mobiles)) throw new Error('mobiles must be sent as an array');
    if (typeof message !== 'string') throw new Error('message must be an array');

    await this.getToken();

    const res = await axios.post(this.getSendURL, {
      Messages: [message],
      MobileNumbers: mobiles,
      LineNumber: this.sendingNumber,
      SendDateTime: new Moment().format(),
      CanContinueInCaseOfError: 'true',
    }, {
      headers: { 'x-sms-ir-secure-token': this.token },
    });

    if (!res.data.IsSuccessful) {
      console.log(res.data);
      throw new Error(res.data.Message);
    }
  }
}

module.exports = new SMSHelper({
  secretKey,
  userApiKey,
  templateId,
  sendingNumber,
});

// getCredit
// { Credit: 4017,
//   IsSuccessful: true,
//   Message: 'درخواست شما با موفقیت انجام شد' }

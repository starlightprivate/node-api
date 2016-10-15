import mailCtrl from '../../api/controllers/mail';
import smsCtrl from '../../api/controllers/sms';
import leadoutpostCtrl from '../../api/controllers/leadoutpost';
import resError from '../../api/middlewares/res_error';
import resSuccess from '../../api/middlewares/res_success';

function route(router) {
  router.use(resError);
  router.use(resSuccess);

  router.get('/get-lead/:id', mailCtrl.getLead);
  router.post('/create-lead', mailCtrl.createKonnektiveLead);
  router.post('/create-order', mailCtrl.addKonnektiveOrder);
  router.post('/upsell', mailCtrl.upsell);
  router.get('/get-trans/:id', mailCtrl.getTrans);

  router.get('/verify-phone/:phone', mailCtrl.verifyPhoneNumber);
  
  router.post('/text/:contactId', smsCtrl.sendSMS);
  router.get('/text/:contactId', smsCtrl.sendSMS);
  router.get('/text2', smsCtrl.sendSMS2);
  router.post('/text2', smsCtrl.sendSMS2);
  router.get('/aphq', mailCtrl.triggerJourney);
  router.post('/aphq', mailCtrl.triggerJourney);
  
  router.get('/state/:stateNumber', mailCtrl.getStateInfo);
  router.get('/ipinfo', mailCtrl.getIpinfo);
  router.get('/ping' , mailCtrl.ping);
  
  router.post('/add-contact', leadoutpostCtrl.addContact);
  router.post('/update-contact', leadoutpostCtrl.updateContact);
  router.post('/add-leadoutpost', leadoutpostCtrl.addLeadoutpost);

  //router.get('/run-migrator', leadoutpostCtrl.migrate);
};

var routes = {v1_0 : route};

export {routes};

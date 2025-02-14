const express = require('express');
const SubscriptionRoute = express.Router();
const subscriptionController = require('../controller/subscriptionController');

SubscriptionRoute.get('/get-subscription', subscriptionController.getSubscriptionData);
SubscriptionRoute.get('/user-subscription/:userId', subscriptionController.getUserSubscription);
SubscriptionRoute.post('/create-subscription', subscriptionController.createSubscriptionData);
SubscriptionRoute.delete('/remove-subscription/:id', subscriptionController.deleteSubscriptionData);
SubscriptionRoute.put('/edit-subscription/:id', subscriptionController.editSubscriptionData);
SubscriptionRoute.get('/get-subscription/:userId', subscriptionController.getSubscriptionDataById);
SubscriptionRoute.get('/get-subscription-by-subscribedBy/:subscribedBy', subscriptionController.getSubscriptionDataBySubscribedBy);
SubscriptionRoute.get('/get-subscription-count/:subscribedBy', subscriptionController.getSubscriptionDataCount);
SubscriptionRoute.put('/revoke-subscription/:userSubscriptionId', subscriptionController.revokeSubscription);
SubscriptionRoute.delete('/delete-subscription-user/:userSubscriptionId', subscriptionController.deleteSubscriptionUser);
SubscriptionRoute.put('/cancel-subscription/:userId', subscriptionController.cancelMainUserSubscription);


module.exports = SubscriptionRoute;
import React from 'react';
import { FeatureItem } from './FeatureItem';

const SubscriptionCard = ({ title, children, className }) => (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        {children}
    </div>
);

export const SubscriptionOverview = ({
    subscriptionPlan,
    customerSubscriptionDetails,
    userSubscribedCount,
    onCancelSubscription,
    getDateDetails,
    remainingTime,
    currentLanguage
}) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{subscriptionPlan?.mainTitle}</h2>
                <button
                    onClick={onCancelSubscription}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                    Cancel Subscription
                </button>
            </div>
        </div>

        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SubscriptionCard title="Subscription Period">
                    <div className="space-y-2">
                        <p className="text-gray-900">
                            <span className="font-medium">Start:</span> {getDateDetails(customerSubscriptionDetails?.startTime)}
                        </p>
                        <p className="text-gray-900">
                            <span className="font-medium">End:</span> {getDateDetails(customerSubscriptionDetails?.endTime)}
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-lg font-semibold text-blue-600">
                                {remainingTime(customerSubscriptionDetails?.endTime)?.days} days left
                            </span>
                        </div>
                    </div>
                </SubscriptionCard>

                <SubscriptionCard title="User Management">
                    <div className="space-y-2">
                        <p className="text-gray-900">
                            <span className="font-medium">Active Users:</span> {userSubscribedCount}
                        </p>
                        <p className="text-gray-900">
                            <span className="font-medium">Total Capacity:</span> {subscriptionPlan?.users}
                        </p>
                        <div className="mt-3">
                            <div className="h-2 bg-gray-200 rounded">
                                <div
                                    className="h-2 bg-blue-600 rounded transition-all duration-300"
                                    style={{ width: `${(userSubscribedCount / subscriptionPlan?.users) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </SubscriptionCard>

                <SubscriptionCard title="Plan Features">
                    <ul className="space-y-2">
                        {subscriptionPlan?.features?.slice(0, 4).map((feature, index) => (
                            <FeatureItem
                                key={index}
                                feature={feature}
                                currentLanguage={currentLanguage}
                            />
                        ))}
                    </ul>
                </SubscriptionCard>
            </div>
        </div>
    </div>
);
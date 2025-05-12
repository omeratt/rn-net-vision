#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RnNetVision, NSObject)

RCT_EXTERN_METHOD(startDebugger:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getHostIPAddress:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
                  
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
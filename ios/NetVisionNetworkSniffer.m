#if DEBUG
 #import <objc/runtime.h>
 #import <Foundation/Foundation.h>
 #import <React/RCTNetworking.h>
 #import <RnNetVision-Swift.h>

 @interface NetVisionNetworkSniffer : NSObject
 @end

 @implementation NetVisionNetworkSniffer

 + (void)load {
   NSLog(@"🧠 [NetVision] Swizzling networkTaskWithRequest:completionBlock:");

   Class cls = NSClassFromString(@"RCTNetworking");
   if (!cls) {
     NSLog(@"❌ [NetVision] RCTNetworking not found");
     return;
   }

   SEL selector = NSSelectorFromString(@"networkTaskWithRequest:completionBlock:");
   Method originalMethod = class_getInstanceMethod(cls, selector);
   if (!originalMethod) {
     NSLog(@"❌ [NetVision] Method not found: networkTaskWithRequest:completionBlock:");
     return;
   }

   IMP originalIMP = method_getImplementation(originalMethod);

   IMP swizzledIMP = imp_implementationWithBlock(^id(id self, NSURLRequest *request, void (^originalCompletion)(NSURLResponse *, NSData *, NSError *)) {
     NSTimeInterval startTime = [[NSDate date] timeIntervalSince1970] * 1000.0;
     NSString *urlString = request.URL.absoluteString ?: @"";
     NSNumber *port = request.URL ? @(request.URL.port.integerValue) : @(-1);
     NSSet *ignoredPorts = [NSSet setWithArray:@[@3232, @8088, @8089, @8081]];

     if ([ignoredPorts containsObject:port]) {
       NSLog(@"⏭️ [NetVision] Ignored port: %@", port);
       typedef id (*OrigMethodType)(id, SEL, NSURLRequest *, void (^)(NSURLResponse *, NSData *, NSError *));
       return ((OrigMethodType)originalIMP)(self, selector, request, originalCompletion);

     } else {
       NSLog(@"📡 [NetVision] Intercepted networkTaskWithRequest:\n   ├─ Method: %@\n   ├─ URL: %@\n   └─ Body: %@", request.HTTPMethod, urlString, request.HTTPBody ? @"[Has Body]" : @"(nil)");
     }

     // עיטוף ה־completion כך שנוכל לגשת לתגובה
     void (^wrappedCompletion)(NSURLResponse *, NSData *, NSError *) = ^(NSURLResponse *response, NSData *data, NSError *error) {
       @try {
         NSLog(@"📦 [NetVision] wrappedCompletion called");

         if (![response isKindOfClass:[NSHTTPURLResponse class]]) {
           NSLog(@"⚠️ [NetVision] Response is not NSHTTPURLResponse — skipping");
           originalCompletion(response, data, error);
           return;
         }

         if (![NetVisionDispatcher respondsToSelector:@selector(shared)]) {
           NSLog(@"❌ [NetVision] NetVisionDispatcher.shared not available");
           originalCompletion(response, data, error);
           return;
         }

         NetVisionDispatcher *dispatcher = [NetVisionDispatcher shared];
         if (![dispatcher respondsToSelector:@selector(sendWithRequest:response:data:startTime:)]) {
           NSLog(@"❌ [NetVision] sendWithRequest:response:data:startTime: not implemented");
           originalCompletion(response, data, error);
           return;
         }

         // Call Swift method
         [dispatcher sendWithRequest:request
                            response:(NSHTTPURLResponse *)response
                                data:data
                          startTime:startTime];

       } @catch (NSException *exception) {
         NSLog(@"❌ [NetVision] Exception in wrappedCompletion: %@", exception.reason);
       }

       // Always call the original completion handler
       if (originalCompletion) {
         originalCompletion(response, data, error);
       }
     };

     // קריאה למימוש המקורי
     typedef id (*OrigMethodType)(id, SEL, NSURLRequest *, void (^)(NSURLResponse *, NSData *, NSError *));
     OrigMethodType original = (OrigMethodType)originalIMP;
     return original(self, selector, request, wrappedCompletion);
   });

   method_setImplementation(originalMethod, swizzledIMP);
   NSLog(@"✅ [NetVision] Swizzle complete: networkTaskWithRequest:completionBlock:");
 }

 @end
#endif

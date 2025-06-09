#if DEBUG
#import <objc/runtime.h>
#import <Foundation/Foundation.h>
#import <React/RCTNetworking.h>
#import <RnNetVision-Swift.h>

@interface NetVisionNetworkSniffer : NSObject
@end

@implementation NetVisionNetworkSniffer

+ (void)load {
  // Swizzling to RCTNetworking
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

    void (^wrappedCompletion)(NSURLResponse *, NSData *, NSError *) = ^(NSURLResponse *response, NSData *data, NSError *error) {
      @try {
        NSLog(@"📦 [NetVision] wrappedCompletion called");
        
        // Check if there's an error
        if (error) {
          NSLog(@"⚠️ [NetVision] Error detected: %@", error.localizedDescription);
          
          // Create a standardized error response with status code 520
          NSString *errorMessage = error.localizedDescription ?: @"Unknown error";
          NSHTTPURLResponse *errorResponse = [[NSHTTPURLResponse alloc] 
                                              initWithURL:(request.URL ?: [NSURL URLWithString:@"https://unknown"]) 
                                              statusCode:520 
                                              HTTPVersion:@"1.1" 
                                              headerFields:@{
                                                @"Content-Type": @"application/json",
                                                @"Error-Description": errorMessage,
                                                @"Error-Code": [NSString stringWithFormat:@"%ld", (long)error.code],
                                                @"Error-Domain": error.domain ?: @"NetVision"
                                              }];
          
          // We don't need to put the error in the body since we're
          // using the dedicated error field in the payload
          NSData *errorData = [errorMessage dataUsingEncoding:NSUTF8StringEncoding];
          
          // Get the dispatcher and send the error information
          if ([NetVisionDispatcher respondsToSelector:@selector(shared)]) {
            NetVisionDispatcher *dispatcher = [NetVisionDispatcher shared];
            if ([dispatcher respondsToSelector:@selector(sendWithRequest:response:data:startTime:)]) {
              [dispatcher sendWithRequest:request
                                 response:errorResponse
                                     data:errorData
                               startTime:startTime];
            }
          }
          
          // Call the original completion handler with the original error
          originalCompletion(response, data, error);
          return;
        }
        
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

        [dispatcher sendWithRequest:request
                           response:(NSHTTPURLResponse *)response
                               data:data
                         startTime:startTime];
      } @catch (NSException *exception) {
        NSLog(@"❌ [NetVision] Exception in wrappedCompletion: %@", exception.reason);
      }

      if (originalCompletion) {
        originalCompletion(response, data, error);
      }
    };

    typedef id (*OrigMethodType)(id, SEL, NSURLRequest *, void (^)(NSURLResponse *, NSData *, NSError *));
    OrigMethodType original = (OrigMethodType)originalIMP;
    return original(self, selector, request, wrappedCompletion);
  });

  method_setImplementation(originalMethod, swizzledIMP);
  NSLog(@"✅ [NetVision] Swizzle complete: networkTaskWithRequest:completionBlock:");
}

@end
#endif

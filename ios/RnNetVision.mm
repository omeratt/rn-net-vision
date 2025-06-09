#import <React/RCTBridgeModule.h>
#import <objc/message.h>
#import <Foundation/Foundation.h>
#import <RnNetVision-Swift.h>

__attribute__((constructor))
static void registerInterceptorEarly(void) {
#if DEBUG
  Class sslClass = NSClassFromString(@"RNSslPinning");

  if (sslClass && [sslClass respondsToSelector:@selector(setRequestObserver:)]) {
    NSLog(@"\U0001F4CA [NetVision] Hooking into RNSslPinning observers");

    void (^requestObserver)(NSURLRequest *) = ^(NSURLRequest *request) {
      // Note: No need to track request start times using our dictionary anymore
      // as RNSslPinning now passes that directly to the response observer
      NSLog(@"\U0001F4E4 [NetVision] Observed request: %@", request.URL.absoluteString);
    };

    void (^responseObserver)(NSURLRequest *, NSHTTPURLResponse *, NSData *, NSTimeInterval) = ^(NSURLRequest *request, NSHTTPURLResponse *response, NSData *data, NSTimeInterval requestStartTime) {
      // We'll use the startTime passed from RNSslPinning directly instead of our own tracking
      NSTimeInterval endTime = [[NSDate date] timeIntervalSince1970] * 1000.0;
      NSTimeInterval duration = endTime - requestStartTime;
      
      NSLog(@"\U0001F4E5 [NetVision] Observed response (%ld): %@ (start: %.0f, end: %.0f, duration: %.2fms)",
            (long)(response ? response.statusCode : 0),
            request.URL.absoluteString,
            requestStartTime,
            endTime,
            duration);
      
      // Create a standardized response object for error cases
      NSHTTPURLResponse *standardizedResponse = response;
      NSData *responseData = data;
      
      // If we have no response or it's an error (status code 0), create a standardized one
      if (!response || response.statusCode == 0) {
          // Extract error message from data if possible
          NSString *errorMessage = nil;
          if (data) {
              errorMessage = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
          }
          
          if (!errorMessage) {
              errorMessage = @"Unknown network error";
          }
          
          // Create headers with error information
          NSMutableDictionary *headers = [NSMutableDictionary dictionary];
          [headers setObject:errorMessage forKey:@"Error-Description"];
          [headers setObject:@"NetVision" forKey:@"Error-Source"];
          
          // Create a synthetic response with status code 520 (our standard error code)
          standardizedResponse = [[NSHTTPURLResponse alloc] initWithURL:request.URL
                                                            statusCode:520
                                                           HTTPVersion:@"HTTP/1.1"
                                                          headerFields:headers];
          
          // Keep the original error message in the data
          responseData = data;
      }
      
      // Log response details with more information
      if (standardizedResponse) {
        if (standardizedResponse.statusCode == 520) {
          // This is our standard error code for synthetic responses
          NSString *errorDesc = [standardizedResponse.allHeaderFields objectForKey:@"Error-Description"] ?: @"Unknown error";
          NSLog(@"\U0001F4E5 [NetVision] Observed error response (%ld): %@ - %@",
                (long)standardizedResponse.statusCode,
                request.URL.absoluteString,
                errorDesc);
        } else {
          NSLog(@"\U0001F4E5 [NetVision] Observed response (%ld): %@",
                (long)standardizedResponse.statusCode,
                request.URL.absoluteString);
        }
      } else {
        NSLog(@"\U0001F4E5 [NetVision] Observed response (null): %@",
              request.URL.absoluteString);
      }

      // This gets called if there's an error with the response as well
      if ([NetVisionDispatcher respondsToSelector:@selector(shared)]) {
        [[NetVisionDispatcher shared] sendWithRequest:request
                                             response:standardizedResponse
                                                 data:responseData ? responseData : [NSData new]
                                           startTime:requestStartTime];
      }
    };

    ((void (*)(id, SEL, void (^)(NSURLRequest *)))objc_msgSend)(sslClass, @selector(setRequestObserver:), requestObserver);
    ((void (*)(id, SEL, void (^)(NSURLRequest *, NSHTTPURLResponse *, NSData *, NSTimeInterval)))objc_msgSend)(sslClass, @selector(setResponseObserver:), responseObserver);

    NSLog(@"✅ [NetVision] Observers registered successfully");
  } else {
    NSLog(@"⚠️ [NetVision] RNSslPinning not found or does not respond to observer methods");
  }
#endif
}

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
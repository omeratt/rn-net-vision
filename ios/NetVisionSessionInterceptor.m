#if DEBUG
#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import <RnNetVision-Swift.h>

@interface NetVisionSessionInterceptor : NSObject
@end

@implementation NetVisionSessionInterceptor

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NSLog(@"🧠 [NetVision] Swizzling NSURLSession dataTaskWithRequest:completionHandler:");

    Class class = [NSURLSession class];
    SEL originalSelector = @selector(dataTaskWithRequest:completionHandler:);
    Method originalMethod = class_getInstanceMethod(class, originalSelector);

    if (!originalMethod) {
      NSLog(@"❌ [NetVision] Failed to find method on NSURLSession");
      return;
    }

    IMP originalIMP = method_getImplementation(originalMethod);

    IMP swizzledIMP = imp_implementationWithBlock(^NSURLSessionDataTask* (id self, NSURLRequest *request, void (^completionHandler)(NSData *data, NSURLResponse *response, NSError *error)) {
      NSNumber *port = request.URL ? @(request.URL.port.integerValue) : @(-1);
      NSSet *ignoredPorts = [NSSet setWithArray:@[@3232, @8088, @8089, @8081]];

      if ([ignoredPorts containsObject:port]) {
        NSLog(@"⏭️ [NetVision] Ignored port: %@", port);

        // קריאה ל־original
        typedef NSURLSessionDataTask *(*OrigMethodType)(id, SEL, NSURLRequest *, void (^)(NSData *, NSURLResponse *, NSError *));
        return ((OrigMethodType)originalIMP)(self, _cmd, request, completionHandler);
      }

      NSTimeInterval startTime = [[NSDate date] timeIntervalSince1970] * 1000.0;

      NSURLSessionDataTask *task = ((NSURLSessionDataTask* (*)(id, SEL, NSURLRequest *, void (^)(NSData *, NSURLResponse *, NSError *)))originalIMP)(self, originalSelector, request, ^(NSData *data, NSURLResponse *response, NSError *error) {
        @try {
          if ([NetVisionDispatcher respondsToSelector:@selector(shared)]) {
            [[NetVisionDispatcher shared] sendWithRequest:request
                                                  response:response
                                                      data:data
                                                  startTime:startTime];
          }
        } @catch (NSException *e) {
          NSLog(@"❌ [NetVision] Interceptor exception: %@", e.reason);
        }

        if (completionHandler) {
          completionHandler(data, response, error);
        }
      });

      NSLog(@"📡 [NetVision] Intercepted SSL-pinned task: %@", request.URL.absoluteString);
      return task;
    });

    method_setImplementation(originalMethod, swizzledIMP);
    NSLog(@"✅ [NetVision] Swizzle complete: dataTaskWithRequest:completionHandler:");
  });
}

@end
#endif

import { ConfigPlugin, withAppDelegate, withMainActivity } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

const withIosAppDelegateImport: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withAppDelegate(config, (config) => {
    const newSrc = ['#import <RNKeyEvent.h>'];
    const newConfig = mergeContents({
      tag: 'react-native-keyevent-import',
      src: config.modResults.contents,
      newSrc: newSrc.join('\n'),
      anchor: `#import "AppDelegate.h"`,
      offset: 1,
      comment: '//',
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};
const withIosAppDelegateBody: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withAppDelegate(config, (config) => {
    const newSrc = [
      'RNKeyEvent *keyEvent = nil;',
      ' ',
      '- (NSMutableArray<UIKeyCommand *> *)keyCommands {',
      '  NSMutableArray *keys = [NSMutableArray new];',
      '   ',
      '  if (keyEvent == nil) {',
      '    keyEvent = [[RNKeyEvent alloc] init];',
      '  }',
      '   ',
      '  if ([keyEvent isListening]) {',
      '    NSArray *namesArray = [[keyEvent getKeys] componentsSeparatedByString:@","];',
      '     ',
      '    NSCharacterSet *validChars = [NSCharacterSet characterSetWithCharactersInString:@"ABCDEFGHIJKLMNOPQRSTUVWXYZ"];',
      '     ',
      '    for (NSString* names in namesArray) {',
      '      NSRange  range = [names rangeOfCharacterFromSet:validChars];',
      '       ',
      '      if (NSNotFound != range.location) {',
      '        [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:UIKeyModifierShift action:@selector(keyInput:)]];',
      '      } else {',
      '        [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:0 action:@selector(keyInput:)]];',
      '      }',
      '    }',
      '  }',
      '   ',
      '  return keys;',
      '}',
      '',
      '- (void)keyInput:(UIKeyCommand *)sender {',
      '  NSString *selected = sender.input;',
      '  [keyEvent sendKeyEvent:selected];',
      '}',
    ];
    const newConfig = mergeContents({
      tag: 'react-native-keyevent-body',
      src: config.modResults.contents,
      newSrc: newSrc.join('\n'),
      anchor: `@implementation AppDelegate`, // /#import "AppDelegate\.h"/g,
      offset: 1,
      comment: '//',
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};

const withAndroidMainActivityImport: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withMainActivity(config, (config) => {
    const newSrc = [
      'import android.view.KeyEvent;',
      'import com.github.kevinejohn.keyevent.KeyEventModule;',
    ];
    const newConfig = mergeContents({
      tag: 'react-native-keyevent-import',
      src: config.modResults.contents,
      newSrc: newSrc.join('\n'),
      anchor: `;`,
      offset: 1,
      comment: '//',
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};
const withAndroidMainActivityBody: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withMainActivity(config, (config) => {
    const newSrc = [
      '@Override',
      'public boolean onKeyDown(int keyCode, KeyEvent event) {',
      '',
      '  // // Uncomment this is key events should only trigger once when key is held down',
      '  // if (event.getRepeatCount() == 0) {',
      '  //   KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);',
      '  // }',
      '',
      '  // // This will trigger the key repeat if the key is held down',
      '  // // Comment this out if uncommenting the above',
      '  KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);',
      '',
      '  // // Uncomment this if you want the default keyboard behavior',
      '  // return super.onKeyDown(keyCode, event);',
      '',
      '  // // The default keyboard behaviour wll be overridden',
      '  // // This is similar to what e.preventDefault() does in a browser',
      '  // // comment this if uncommenting the above',
      '  super.onKeyDown(keyCode, event);',
      '  return true;',
      '}',
      '',
      '@Override',
      'public boolean onKeyUp(int keyCode, KeyEvent event) {',
      '  KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);',
      '',
      '  // // Uncomment this if you want the default keyboard behavior',
      '  // return super.onKeyUp(keyCode, event);',
      '',
      '  // // The default keyboard behaviour wll be overridden',
      '  // // This is similar to what e.preventDefault() does in a browser',
      '  // // comment this if uncommenting the above',
      '  super.onKeyUp(keyCode, event);',
      '  return true;',
      '}',
      '',
      '@Override',
      'public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {',
      '    KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);',
      '    return super.onKeyMultiple(keyCode, repeatCount, event);',
      '}',
    ];
    const newConfig = mergeContents({
      tag: 'react-native-keyevent-body',
      src: config.modResults.contents,
      newSrc: newSrc.join('\n'),
      anchor: `public class MainActivity extends ReactActivity {`,
      offset: 1,
      comment: '//',
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};

const initPlugin: ConfigPlugin = (config) => {
  config = withIosAppDelegateImport(config);
  config = withIosAppDelegateBody(config);
  config = withAndroidMainActivityImport(config);
  config = withAndroidMainActivityBody(config);
  return config;
};

export default initPlugin;
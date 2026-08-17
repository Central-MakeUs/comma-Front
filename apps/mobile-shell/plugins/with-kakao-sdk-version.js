const fs = require('node:fs');
const path = require('node:path');
const { withDangerousMod } = require('@expo/config-plugins');

const DEFAULT_KAKAO_SDK_VERSION = '2.22.7';

module.exports = function withKakaoSdkVersion(config, props = {}) {
  const version = props.version || DEFAULT_KAKAO_SDK_VERSION;
  const assignment = `$KakaoSDKVersion = '${version}'`;

  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (/^\$KakaoSDKVersion\s*=.*$/m.test(podfile)) {
        podfile = podfile.replace(/^\$KakaoSDKVersion\s*=.*$/m, assignment);
      } else {
        podfile = `${assignment}\n${podfile}`;
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    }
  ]);
};

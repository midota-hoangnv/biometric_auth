<template>
  <v-layout justify-center>
    <v-card-actions>
      <v-btn color="info" @click="register"
        >Setting biometric authentication</v-btn
      >
    </v-card-actions>
  </v-layout>
</template>
<script>
import {
  create,
  parseCreationOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";

export default {
  name: "SettingPage",
  data() {
    return {};
  },
  methods: {
    async register() {
      try {
        const config = await this.$api.registerStart();
        // const options = parseCreationOptionsFromJSON({
        //   publicKey: {
        //     challenge: 'YWFh',
        //     rp: {
        //       name: "Duo Security",
        //       id: "localhost",
        //     },
        //     user: {
        //       id: 'YWFh',
        //       name: 'YWFh',
        //       displayName: 'YWFh',
        //       // id: '1',
        //       // name: "lee@webauthn.guide",
        //       // displayName: "Lee",
        //     },
        //     pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        //     authenticatorSelection: {
        //       authenticatorAttachment: "cross-platform",
        //     },
        //     timeout: 60000,
        //     attestation: "direct",
        //   },
        // });
        const options = parseCreationOptionsFromJSON({publicKey: config});
        const response = await create(options);

        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

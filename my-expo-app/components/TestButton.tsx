import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Chip, Text } from "@rneui/themed";
import { supabase } from "../lib/supabase";

export default function TestButton() {
  const testFunction = async () => {
    const session = await supabase.auth
      .getSession()
      .then(({ data }) => data.session);
    const { data, error } = await supabase.functions.invoke("hello-world", {
      body: { name: "Functions" },
    });
    alert(data);
  };

  return (
    <View style={{ alignItems: "center" }}>
      {
        <Chip
          title="Click here to make a new entry"
          onPress={() => testFunction()}
        />
      }
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Chip, Text } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";

export default function TestButton() {
  const testFunction = async () => {
    const session = await supabase.auth
      .getSession()
      .then(({ data }) => data.session);
    const { data, error } = await supabase.functions.invoke("hello-world", {
      body: { name: "Functions" },
    });
    if (data) {
      alert("data: " + data);
    }
    if (error) {
      console.log(error);
      if (error instanceof FunctionsHttpError) {
        console.log(await error.context.json());
      }
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      {<Chip title="Add entry to testtable" onPress={() => testFunction()} />}
    </View>
  );
}

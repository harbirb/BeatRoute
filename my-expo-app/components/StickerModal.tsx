import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import Modal from "react-native-modal";
import { PolylineSticker } from "./PolylineSticker";
import { supabase } from "../lib/supabase";
import polyline from "@mapbox/polyline";
import { TextSticker } from "./TextSticker";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddSticker: (sticker: Sticker) => void;
};

interface Sticker {
  id: number;
  type: "polyline" | "text";
  data: string;
  color: string;
  thickness: number;
}

export const StickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onAddSticker,
}) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [stickers, setStickers] = useState<Sticker[]>([
    {
      id: 2,
      type: "polyline",
      data: "_qciF~kbN}BgDyD}CkAeCkBeGoBuJ{A_GsA_GeAwGgAiIcAgGsBsHgBsHoAwF{CwHgCoGsB}EsBoDiEiDiD{B{C_B{Dq@aD{AiCeCcBmBgCeAwDo@_DeBwCcBsCgBqCcA",
      color: "green",
      thickness: 5,
    },
    {
      id: 6,
      type: "polyline",
      data: "}ntkH~u~nVCCwAAs@Gc@?]EaBLM?CB}@@]CGEQk@o@By@Ag@D}ADIAEECQ?aCPiJ?{@BeA?gADgCBkCJeDAoCDsDEmJDuBCu@Dk@EiAEU?sAHmAf@}DQ[M_@Ms@EeA@w@Cq@Bm@@yCF}@@gAEaBDo@CsBHaBFaC?mDGw@PmDHcDCuADwEGaBFk@AyCGmBDi@Aw@FwGAoBJyBEc@Aq@@s@EIKAwCF]AWCu@BSCqADa@CcBBa@EkAAMOIs@?wDDgIQG?jCDTFB|BVj@JdBDj@CdBBp@Dz@C~@Bd@ADFDf@DdBCdEEx@@`E@v@C~@?tCEnABbB?xDC~@?rCIdLCxAEV?tCDz@ExABr@EX?rCGdE?dGI|C@jAAxADl@GZ?f@@b@Lj@b@l@YnASxAItB@|AG|ADvAM`UAbGC~EE~ABxDOnI@nAD\\Tb@JHjBDh@A^B`A?d@BfACnAFlAA",
      color: "red",
      thickness: 5,
    },
    {
      id: 3,
      type: "polyline",
      data: "ki{eFvqfiVqAWQIGEEKAYJgBVqDJ{BHa@jAkNJw@Pw@V{APs@^aABQAOEQGKoJ_FuJkFqAo@{A}@sH{DiAs@Q]?WVy@`@oBt@_CB]KYMMkB{AQEI@WT{BlE{@zAQPI@ICsCqA_BcAeCmAaFmCqIoEcLeG}KcG}A}@cDaBiDsByAkAuBqBi@y@_@o@o@kB}BgIoA_EUkAMcACa@BeBBq@LaAJe@b@uA`@_AdBcD`@iAPq@RgALqAB{@EqAyAoOCy@AmCBmANqBLqAZkB\\iCPiBJwCCsASiCq@iD]eA]y@[i@w@mAa@i@k@g@kAw@i@Ya@Q]EWFMLa@~BYpAFNpA`Aj@n@X`@V`AHh@JfB@xAMvAGZGHIDIAWOEQNcC@sACYK[MSOMe@QKKKYOs@UYQISCQ?Q@WNo@r@OHGAGCKOQ_BU}@MQGG]Io@@c@FYNg@d@s@d@ODQAMOMaASs@_@a@SESAQDqBn@a@RO?KK?UBU\\kA@Y?WMo@Iy@GWQ_@WSSGg@AkABQB_Ap@_A^o@b@Q@o@IS@OHi@n@OFS?OI}@iAQMQGQC}@DOIIUK{@IUOMyBo@kASOKIQCa@L[|AgATWN[He@?QKw@FOPCh@Fx@l@TDLELKl@aAHIJEX@r@ZTDV@LENQVg@RkA@c@MeA?WFOPMf@Ej@Fj@@LGHKDM?_@_@iC?a@HKRIl@NT?FCHMFW?YEYGWQa@GYBiAIq@Gq@L_BHSHK|@WJETSLQZs@z@_A~@uA^U`@G\\CRB\\Tl@p@Th@JZ^bB`@lAHLXVLDP?LGFSKiDBo@d@wBVi@R]VYVE\\@`@Lh@Fh@CzAk@RSDQA]GYe@eAGWSiBAWBWBIJORK`@KPOPSTg@h@}Ad@o@F[E_@EGMKUGmAEYGMIMYKs@?a@J}@@_BD_@HQJMx@e@LKHKHWAo@UoAAWFmAH}@?w@C[YwAAc@HSNM|Ao@rA}@zAq@`@a@j@eAxAuBXQj@MXSR[b@gAFg@?YISOGaAHi@Xw@v@_@d@WRSFqARUHQJc@d@m@`A[VSFUBcAEU@WFULUPa@v@Y~@UrBc@dBI~@?l@P~ABt@N`HEjA]zAEp@@p@TrBCl@CTQb@k@dAg@jAU^KJYLK@k@A[Js@d@a@b@]RgBl@[FMAw@[]G]?m@D_@F]P[Vu@t@[TMF_@Do@E_@@q@P]PWZUZw@vAkAlAGJOj@IlAMd@OR{@p@a@d@sBpD]v@a@`Aa@n@]TODgBVk@Pe@^cBfBc@Rs@La@RSPm@|@wCpDS^Wp@QZML{@l@qBbCYd@k@lAIVCZBZNTr@`@RRHZANIZQPKDW@e@CaASU?I@YTKRQx@@\\VmALYRQLCL?v@P|@D\\GJEFKDM@OCa@COOYIGm@YMUCM@]JYr@uAx@kAt@}@jAeAPWbAkBj@s@bAiAz@oAj@m@VQlAc@VQ~@aA`Au@p@Q`AIv@MZORUV_@p@iB|AoCh@q@dAaANUNWH[N{AJ[^m@t@_Av@wA\\a@`@W`@In@Al@B^E`@Wl@u@\\[VQ\\K`@Eb@?R@dAZP@d@CRExAs@\\Yt@{@LG\\MjAATINOXo@d@kAl@_AHYBOCe@QiBCm@Fq@\\wADo@AyGEeBWuB@YHu@Tu@Lk@VcCTo@d@aA\\WJE`@G~@FP?VI\\U~@sANO`@SfAMj@U\\WjAsAXS`@UNENALBHFFL?^Ml@Uj@]b@q@RUJSPkChEc@XcAb@sA|@]PaA\\OJKNER?TDTNj@Jn@?p@OfC@ZR`B@VCV_@n@{@l@WbACv@OlABnAPl@LNNHbBBNBLFFJ@^GLg@x@i@|AMP[X}@XOJKPET?l@LhAFXp@fBDRCd@S\\_@Ps@PQ@}A]S?QDe@V]b@MR[fAKt@ErAF~CANILYDKGIKe@{@Yy@e@sB[gA[c@e@YUCU?WBUHUNQPq@`AiArAMV[^e@Zc@JQJKNMz@?r@Bb@PfAAfA@VVbADn@E`@KHSEe@SMAKDKFM\\^dDCh@m@LoAQ_@@MFOZLfBEl@QbASd@KLQBOAaAc@QAQ@QHc@v@ONMJOBOCg@c@]O[EMBKFGL?RHv@ARERGNe@h@{@h@WVGNDt@JLNFPFz@LdBf@f@PJNHPF`ADPJJJDl@I`@B^Tp@bALJNDNALIf@i@PGPCt@DNE`@Uv@[dAw@RITGRCtAARBPJLPJRZxB?VEX_@vAAR?RDNHJJBh@UnBm@h@IRDRJNNJPNbBFRJLLBLCzAmAd@Uf@Gf@?P@PFJNHPFTH`BDTHNJJJ@LG`@m@^YPER@RDPHNNJRLn@HRLN^VNPHTFX@\\UlDFb@FHh@NP@HKPsB?}ASkCQ{@[y@q@}@cA{@KOCQDa@t@{CFGJCf@Nl@ZtA~@r@p@`@h@rAxBd@rA\\fARdAPjANrB?f@AtBCd@QfBkAjJOlBChA?rBFrBNlBdAfKFzAC~@Iz@Mz@Sv@s@jBmAxBi@hAWt@Sv@Qx@O`BA`@?dAPfBVpAd@`BfBlFf@fBdA~Cr@pAz@fApBhBjAt@H?IL?FBFJLx@^lHvDvh@~XnElCbAd@pGhDbAb@nAr@`Ad@`GhDnBbAxCbBrWhNJJDPARGP_@t@Qh@]pAUtAoA`Ny@jJApBBNFLJFJBv@Hb@HBF?\\",
      color: "blue",
      thickness: 5,
    },
    {
      id: 223,
      type: "text",
      data: "106.22 km",
      color: "black",
      thickness: 5,
    },
    {
      id: 2233,
      type: "text",
      data: "4:30 /km",
      color: "black",
      thickness: 5,
    },
  ]);

  // useEffect(() => {
  //   supabase.functions.invoke("get-recent-activity").then(({ data }) => {
  //     data.forEach((SummaryActivity: any) => {
  //       setStickers([
  //         ...stickers,
  //         {
  //           id: SummaryActivity.map.id,
  //           type: "polyline",
  //           data: processPolyline(SummaryActivity.map.summary_polyline),
  //           color: "green",
  //         },
  //       ]);
  //     });
  //   });
  // }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeThreshold={100}
      // todo: allow scroling in modal without closign it
      onSwipeComplete={onClose}
      swipeDirection={isScrollEnabled ? [] : "down"}
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
    >
      <View style={styles.modalView}>
        <View
          style={{
            width: 40,
            height: 5,
            backgroundColor: "#ccc",
            borderRadius: 99,
            marginBottom: 20,
          }}
        />
        <FlatList
          data={stickers}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onAddSticker({ ...item, id: Math.random() * 100 });
                onClose();
              }}
              style={{
                width: 200,
                height: 200,
                backgroundColor: "lightgray",
              }}
            >
              {item.type === "polyline" ? (
                <PolylineSticker stickerData={item} scale={0.35} />
              ) : (
                <TextSticker stickerData={item} scale={0.6} />
              )}
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <View style={{ height: 20, width: 20 }} />
          )}
          style={{ padding: 20 }}
          // columnWrapperStyle={{
          //   justifyContent: "space-between",
          //   columnGap: 20,
          // }}
          onScrollBeginDrag={() => {
            setIsScrollEnabled(true);
          }}
          onScrollEndDrag={() => {
            setIsScrollEnabled(false);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});

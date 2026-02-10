import { Activity, RideActivity, RunActivity } from "@/context/DataContext";

// --- The full, detailed data, conforming to the new types ---
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "run1",
    type: "run",
    name: "Morning 5k Run",
    date: "2023-10-24T08:00:00Z",
    distanceInMeters: 5000,
    durationInSeconds: 1500, // 25 minutes
    pace: "5'00\"/km",
    elevationGainInMeters: 50,
    averageHeartRate: 145,
    polyline:
      "yatkHdh_oVhA?t@FTD\\VH@fB?H@BH?p@Dx@G`@AT@nAK`QC`LCbAEJSPALHr@@d@O~IFjIGbD?bDKhAFlAA`KBnHPfHVfDr@tFx@bFJbAnA~F`B`Hv@vCNZb@NHHHLL^`@nBTrA@d@MhA@TVf@j@`@PX~CrMnA`FDd@Ef@Kr@@NNr@FHTHTTP\\HXFZ@TCr@BJ`@x@fA|Dz@bE\\hBh@bB^|AHn@?rAARMb@cArBSXsBvBu@l@c@XGJCr@GJi@h@g@r@IFSFSPa@h@cAhAq@`Aw@v@iAxAy@rB[hAGv@Hh@ANKd@_@fA]l@SXc@^e@RiA\\kAXcCp@q@Xc@Xw@`A[l@]lAgApEWr@U\\WVYPeAZ[LKHS\\Yr@S\\WZe@VYFM?sA_@YAa@J_@VUXS`@oBpFe@~@WT[Ni@BmCm@kAUg@CmBAqAO_@KsAc@}@i@oB{Ao@m@IMSc@O{@s@qAUi@yAmEo@yAk@cA_AaCY{@_B_E_BwCoAuC_ByEYiA]kAeA_GM{@Ke@CU@UPq@?MU]Qe@GQIaAOkDOkHGqF@eCFmIHyCJmBHoCVwEJaBX}BDwAn@eGVyBp@sEhB_KzAmGj@sBl@_CdAkD|DyK|AuDfB_FrAeDNk@Ho@Pi@~BuFvDwJh@}APSJCH@HBHHJXB\\@pCMxN?hEC|CCt@MfAK`AKj@q@hCORIBIAIGK[S{AO{AWgA_@qAMYk@eA}BcDMYAO@ODM\\q@|E_Mb@aAtA{DNUHCJ@PJNb@Bh@?rBKjQ?pCCfDOdBWpBw@rCGHI@KAKGM]U{BQmA[oAa@kAg@cAgCiDK[?OLe@vFgNxCiI`@oCNuAFiAFeCBsFBqB@UDIRAbFJ\\A`A@^CrAF|C?`CF~@AjKNZATi@FERAn@Dr@?HCCcBBgGBw@?gAByAAiCDmFAiA?MJ_@IgADkDAs@FcCCgCBgAAq@CGAAs@ByBG",
    tracklist: [
      {
        id: "song1-1",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-1",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-2",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-2",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-3",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-3",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-4",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-4",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-5",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-5",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-6",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-6",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-7",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-7",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-8",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-8",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-9",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        spotifyUrl: "https://example.com/blinding-lights",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-9",
        title: "Levitating",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
    ],
  },
  {
    id: "ride1",
    type: "ride",
    name: "City Loop Ride",
    date: "2023-10-23T17:00:00Z",
    distanceInMeters: 20000,
    durationInSeconds: 3600, // 1 hour
    averageSpeedKph: 20,
    elevationGainInMeters: 150,
    polyline:
      "}iskHdaeoVf@m@LeAWaAi@WmDdCSf@Ct@X`An@R`DcCVu@AaA]q@g@KcDdCYzAXbAp@R|C}BXs@@aAYu@i@OgDdCUj@A|@^|@j@JbDgCTw@C}@_@q@g@GcDdCUp@@|@\\t@j@JbDeCHOsBhBbBsAXy@KyA{@e@cDdCUl@At@X|@n@PdDgCTw@C_A[k@k@KcDdCSl@?z@^z@j@J~CeCVw@C{@]s@g@KeDfCSj@Az@Xx@l@NbDcCVo@?cA[q@i@OuCtBQPQf@C|@Xx@l@PbDaCVu@?_A]s@k@KcDdCU|ATz@n@VdDcCXw@Aw@[w@e@MgD`CYbAJnAv@b@rAy@rAiAVo@?}@Yw@g@OkDhCSh@At@X|@l@PdDcCTu@AeA[k@g@MeDdCWt@@t@^|@j@HbDiCR{@Cy@[m@g@KcDbCWn@Ax@Xx@n@PdDeCTu@C}@Yq@k@MgDhCQn@?v@Xv@l@N`DcCXw@Ay@Ys@o@O_DbCUj@Cx@Vz@p@R~C_CXu@?aA]u@c@KkDhCU|A\\bAn@L~CeCVw@C{@]s@e@KcDbCWp@Ax@\\z@l@L`DeCTs@?{@Yq@i@QeDbCWr@Av@Xv@n@PdDeCTw@EeA]k@g@G_D`CWl@Ax@Vx@t@R|CaCXy@A{@Yq@i@OgDdCYrAVfAn@V`D}BZw@?}@Uq@k@SgDbC[tATdAn@XfDcCVm@@y@Ok@_@_@o@H_DvCEdARt@h@Zh@SrCkCHgAW_AaAMqC|BWn@Az@Pn@^Vh@E`Aw@gAz@m@Ae@}@H}A~CoC~@HXx@GhAe@r@`@g@Lw@YhAsAhArAgARe@?qAc@w@u@B}CpCK`AP|@f@\\l@OnCaCPeAScA][g@B_DnCO`ALz@^`@j@A~CmCN_AOaAa@a@e@@aDnCO|@NdAd@`@h@IxCkCNcAUcAeAUcDzCGbARx@h@Zl@WpCiCDsAi@aAq@DmCvBWn@Av@Vx@d@Tf@OvCoCDuAg@}@s@BkCtBWl@Cv@Pv@^Xf@E~CqCJgAWaAaAO_DrCM~@RbAh@Zh@OvCoCDqAg@aAu@DkCtBWp@BnAd@p@j@?`Aw@",
    tracklist: [
      {
        id: "song3",
        title: "Watermelon Sugar",
        artists: ["Harry Styles"],
        spotifyUrl: "https://example.com/watermelon-sugar",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e02f4c3b0d6f8e8e8e8e8e8e8e8",
      },
      {
        id: "song4",
        title: "Don't Start Now",
        artists: ["Dua Lipa"],
        spotifyUrl: "https://example.com/dont-start-now",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e02c5f5b0d6f8e8e8e8e8e8e8e8",
      },
      {
        id: "song5",
        title: "Circles",
        artists: ["Post Malone"],
        spotifyUrl: "https://example.com/circles",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e02d6f6b0d6f8e8e8e8e8e8e8e8",
      },
    ],
  },
  {
    id: "run2",
    type: "run",
    name: "Rainy Afternoon Jog",
    date: "2023-10-22T15:30:00Z",
    distanceInMeters: 3000,
    durationInSeconds: 960, // 16 minutes
    pace: "5'20\"/km",
    polyline:
      "sntkH|t_oVI|X`@PtPPfAj@Zz@FbIQpm@\\~L~@~J`ClNbEdN`BzGZhE|@vArBtIAZ|BpHFjDtAzCpHhYbAlAr@?\\Yl[mr@`IuSrO}\\lCaH`CwHrDyO~B{O`A}KlEur@dAcKrAyInQ{bAz[omAPuDDsZPuBjPal@`IgR^mBb@mFf@_CzD}IzEoFf@cAnAwENiH~@wCn@gArAi@tIH~CmAh}@{}@l@_BVuB@}UL}Ed@QhMLfAm@fC_Il@kD|FuUx@iBfAeArA_@~AJt]zJpBzAnBrChAbDn@jE]\\g@c@E_@VyAI{@q@qAyAqA?y@f@gCCg@oCeBeAUiA^}AbCaA`DaElVSxBArg@[XwCa@aBHaBp@oAjAgP~]u@jBc@|BkAnQ{UjjEAxI\\~Hz@`IdEvVFjCQfCi@`CoAnBuAx@kBNsMa@yKsB_LeDoAVuAjCoA~E_@hCVtc@MfG]|DyAvDmBvAoAJqDu@pDr@~AQbByAt@{A\\uAb@wEFuGW_b@ToBjA}Eh@{Av@iApA_@xLtD|HxAtEb@xHFdBK|Ay@nAeBv@kCTiCImDgEkWu@kHYqH?}HtTy_Eb@cLdAmNh@uCdQk`@hAqAdAm@zAY|AD~KpBzLvGxCb@rKgAbKIv@i@d\\@rAYtBDpD]dALbBi@pA?jAr@pMtQXr@StCXpAtGrDt@t@l@`BThCzAx_AAhJ[nHgApLu@lB{Ar@Q\\YlFf@fRiAfHe@fHg@dBf@aBh@_IdAeGe@qRXsFfB_A|@gB`AmK\\uGBoM{AebAc@sB{@yAsGwEIeA^mAM_@q@YeNiRiAy@eAG{Br@qAQyC`@yERy`@MqCXeD_@u@\\kIp@yEaA_IqEkHaBKe@G{KFuZnDuV`A{Dp@_BfBuBhBLtEpChBnCrGfEf@x@l@dCKZaA@qC{@uA`@oA_GaAkCkCmDgCgBkQkFcKaEwAMqA\\_Az@m@jAeIxZ[`Aw@dA\\tAAv@oAtDqAt@eMU{@PC~\\SpBi@xAc}@x}@_DnA}IGwAp@q@nAy@pCQlHgAdE{@zAsEfF{DbJa@jBk@fGa@xBeI`ReP`l@OpBCx[[fDwWfbA_CvGgLtn@iFhZcBvMeFlw@}@lJeCbP_DxMyFlP{Od]uH~R_Px]cJjQgA^m@UYa@eFeSiAoCMcCu@oB{FmUMaCq@sAqGuVqCaP}@kK]yKNmm@QeMc@YuTg@@oW",

    tracklist: [
      {
        id: "song6",
        title: "Shape of You",
        artists: ["Ed Sheeran"],
        spotifyUrl: "https://example.com/shape-of-you",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e02b7e7b0d6f8e8e8e8e8e8e8e8",
      },
      {
        id: "song7",
        title: "Senorita",
        artists: ["Shawn Mendes", "Camila Cabello"],
        spotifyUrl: "https://example.com/senorita",
        albumArtUrl:
          "https://i.scdn.co/image/ab67616d00001e02a8d8b0d6f8e8e8e8e8e8e8e8",
      },
    ],
  },
];

// --- API Functions ---

/**
 * Simulates fetching the full list of activities.
 */
export const getActivities = async (): Promise<Activity[]> => {
  // console.log('FETCHING: Full mock activity list...');
  // In a real app, this would be: supabase.from('activities').select('*')
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_ACTIVITIES), 500)
  );
};

/**
 * Simulates fetching the full details for a single activity.
 * In our new pattern, this is less likely to be used if the provider is caching,
 * but it's good to have for the list-detail pattern.
 */
export const getActivityById = async (id: string): Promise<Activity | null> => {
  // console.log(`FETCHING: Full details for activity ID: ${id}...`);
  const activity = MOCK_ACTIVITIES.find((a) => a.id === id) || null;
  return new Promise((resolve) => setTimeout(() => resolve(activity), 200)); // Faster since it's a 'find'
};

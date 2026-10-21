// Seasonal-balance table, English notes. `need` arrays are identical to ../johu.ts.
// Source: month-by-month seasonal picks of the classical Qiong Tong Bao Jian / Lan Jiang Wang, as summarized in mainstream Korean practice.
// Simplifications: see the header of ../johu.ts (stem picks converted to elements, duplicates merged,
// summer cells whose classical second pick is the already-excess Fire take Metal instead, half-month and chart-specific exceptions omitted).
import type { JohuCell } from '../types';

export const JOHU: JohuCell[][] = [
  // 0 甲
  [
    { need: [1,  3], note: 'A tall tree born in the dead of winter needs Fire to thaw its frozen trunk, then Metal to shape the timber into something useful.' }, // 子
    { need: [1,  3], note: 'Late winter leaves this tall tree standing in frozen ground. Fire comes first for warmth, and Metal follows, trimming branches so the wood catches easily.' }, // 丑
    { need: [1,  4], note: 'Sprouting in the chilly start of spring, this tree wants sunny Fire to warm it and Water to keep its roots moist as it grows.' }, // 寅
    { need: [3,  1], note: 'Mid-spring is when Wood runs strongest, so Metal is needed first to prune the overgrowth. Fire comes next, letting all that energy show itself to the world.' }, // 卯
    { need: [3,  4], note: 'By late spring the tree is fully grown and heavy. Metal gives it shape, while Water refreshes roots that are starting to dry out.' }, // 辰
    { need: [4,  3], note: 'Early summer heat is building around this tree. Water matters most to keep it from drying out, and Metal backs it up as the source that keeps water coming.' }, // 巳
    { need: [4,  3], note: 'A tall tree under the midsummer sun needs Water above all so its leaves do not scorch. Metal helps too, keeping that water supply from running dry.' }, // 午
    { need: [4,  3], note: 'Late-summer heat leaves the roots parched. Water should come first, with Metal second to sustain the stream and give the branches a clean shape.' }, // 未
    { need: [1,  3], note: 'At the edge of autumn, this tree needs Fire first to bring its talents into bloom. Metal follows, turning raw wood into good timber.' }, // 申
    { need: [1,  3], note: 'In the cool winds of mid-autumn, Fire warms the tree and lets its gifts show. Metal comes after, shaping it into a beam that can hold real weight.' }, // 酉
    { need: [3,  4], note: 'Leaves are falling in late autumn. Metal is needed first to give this tree firm shape, and Water helps by soaking roots stuck in dry earth.' }, // 戌
    { need: [3,  1], note: 'Early winter is a wet, cold season for a tall tree. It calls for Metal to shape the timber and Fire to keep the trunk warm as temperatures drop.' }, // 亥
  ],
  // 1 乙
  [
    { need: [1], note: 'A flower blooming in deep winter needs one thing above all: Fire, the warm sunlight that thaws it out. Once the light arrives, life returns quickly.' }, // 子
    { need: [1], note: 'Small plants on frozen late-winter ground long for Fire. Warm sunshine pulls spring closer and wakes up energy that has been curled up tight.' }, // 丑
    { need: [1,  4], note: 'A fresh sprout in early spring still feels the cold. Sunny Fire clears the chill first, then Water keeps the young shoot moist.' }, // 寅
    { need: [1,  4], note: 'In the middle of spring the blossoms are opening. Fire, like sunlight, helps them open fully, and Water stops them from wilting.' }, // 卯
    { need: [4,  1], note: 'As late-spring sunshine grows hot, this plant needs Water first so it does not dry out. Warm Fire follows to bring the flowers into bloom.' }, // 辰
    { need: [4,  3], note: 'Early-summer sun can parch these leaves fast. Cool Water is the top need, and Metal helps by keeping that water from running out.' }, // 巳
    { need: [4], note: 'Under the blazing midsummer sun, this flower needs Water more than anything. A good drink and the leaves turn fresh and green again.' }, // 午
    { need: [4], note: 'Late-summer heat has worn this plant down. Water to soak the thirsty roots matters most, and with it comes the strength to hold on.' }, // 未
    { need: [1,  4], note: 'Metal turns sharp in early autumn, and a delicate plant feels it. Fire softens that edge first, and Water keeps the roots moist after.' }, // 申
    { need: [4,  1], note: 'Frost is close in mid-autumn. Water to nourish the roots comes first, and a little warm Fire takes the edge off the cool air.' }, // 酉
    { need: [4,  3], note: 'Late autumn dries leaves to a crisp. This plant needs Water most of all, with Metal second as the source that keeps the water flowing.' }, // 戌
    { need: [1,  2], note: 'Sitting beside cold early-winter water, this plant needs Fire first to warm up. Earth follows, holding back the flood to protect its roots.' }, // 亥
  ],
  // 2 丙
  [
    { need: [4,  2], note: 'Like a low winter sun, this fire shines brightest when it reflects off clear Water. Use Water, but let Earth keep it from rising too high.' }, // 子
    { need: [4,  0], note: 'A late-winter sun comes alive when its light glints off clear Water. Wood supports it from behind, feeding the fire so the glow lasts.' }, // 丑
    { need: [4,  3], note: 'This fire is a sun rising in early spring. Clear Water lets the light reflect and travel, and Metal comes next as the source of that water.' }, // 寅
    { need: [4,  2], note: 'A gentle mid-spring sun spreads its light best over Water. Earth then helps by settling the energy and keeping things steady.' }, // 卯
    { need: [4,  0], note: 'Late spring brings thick, heavy Earth that can dim this sun. Water clears the light first, and Wood breaks up the soil next.' }, // 辰
    { need: [4,  3], note: 'Early summer is when this sun gains real force. Water to cool the heat is the biggest need, and Metal keeps that water from drying up.' }, // 巳
    { need: [4,  3], note: 'A noon sun in midsummer burns hot. Water is needed above all to cool things down, and Metal is welcome for keeping the stream alive.' }, // 午
    { need: [4,  3], note: 'In late-summer swelter, this sun needs Water first to calm the heat. Metal is next, feeding the water so it lasts.' }, // 未
    { need: [4,  2], note: 'A sun sinking toward autumn looks its best reflected in clear Water. Earth helps by keeping that water within its banks.' }, // 申
    { need: [4], note: 'Think of a sunset in mid-autumn. Its light is most beautiful over clear Water, so having Water nearby lets this fire glow.' }, // 酉
    { need: [0,  4], note: 'Late-autumn Earth can cloud over this sun. Wood is needed first to break through the soil, and Water follows to make the light clear again.' }, // 戌
    { need: [0,  2], note: 'A sun shining over cold early-winter water needs Wood to keep the flame fed. Earth comes next, damming the water so it cannot drown the light.' }, // 亥
  ],
  // 3 丁
  [
    { need: [0,  3], note: 'Born in deep winter, your candle flame needs Wood to burn and Metal to split that wood so the fire catches well.' }, // 子
    { need: [0,  3], note: 'A candle in the cold late-winter wind needs Wood first to keep the spark alive. Metal comes second, cutting the fuel to the right size.' }, // 丑
    { need: [0,  3], note: 'This lamp is lit in chilly early spring. Wood as fuel matters most, while Metal shapes the logs so they burn easily.' }, // 寅
    { need: [3,  0], note: 'Mid-spring wood is green and damp, so this lamp needs Metal first to split and dry it. Then well-seasoned Wood makes the flame grow.' }, // 卯
    { need: [0,  3], note: 'Thick late-spring Earth can dim this lamp. Wood clears the soil and revives the flame, while Metal trims the fuel.' }, // 辰
    { need: [0,  3], note: 'A lamp in the early-summer warmth needs Wood first to keep the flame steady. Metal follows, cutting the fuel to a useful size.' }, // 巳
    { need: [4,  3], note: 'A candle lit at high noon in midsummer burns too hot. Water to cool it is the top need, and Metal helps by keeping the water flowing.' }, // 午
    { need: [0,  4], note: 'In late-summer swelter, this candle needs Wood first to keep its spark going. Water is welcome alongside it to bring the heat down.' }, // 未
    { need: [0,  3], note: 'As early autumn cools the air, this lamp needs Wood for fuel first. Metal follows, splitting the logs so they catch.' }, // 申
    { need: [0,  3], note: 'Days get shorter in mid-autumn. Wood keeps this lamp\'s spark alive, and Metal shapes the fuel so it burns cleanly.' }, // 酉
    { need: [0,  3], note: 'Heavy late-autumn Earth threatens to smother this lamp. Wood digs through and revives the flame, and Metal helps by trimming the fuel.' }, // 戌
    { need: [0,  3], note: 'A candle beside cold early-winter water needs Wood above all so it stays lit. Metal backs it up, splitting the wood to feed the fire.' }, // 亥
  ],
  // 4 戊
  [
    { need: [1,  0], note: 'A great mountain frozen in deep winter needs Fire first to thaw the ground. Wood comes next, bringing the slopes back to life.' }, // 子
    { need: [1,  0], note: 'Ice covers this mountain in late winter. Warming it with sunny Fire comes first, and Wood helps loosen the hardened soil.' }, // 丑
    { need: [1,  0], note: 'This mountain is still cold in early spring. Sunlike Fire warms the earth first, then Wood grows into forest across its slopes.' }, // 寅
    { need: [1,  0], note: 'A mountain waking up in mid-spring needs warm Fire most. Wood follows close behind, covering the hills in green.' }, // 卯
    { need: [0,  1], note: 'Late spring is when Earth is thickest. Wood is needed first to break up packed soil, and warm Fire comes after.' }, // 辰
    { need: [0,  4], note: 'Early-summer sun is baking this mountain. Wood lets the soil breathe, and Water must come along to keep it from cracking dry.' }, // 巳
    { need: [4,  0], note: 'In midsummer the mountain is scorching. Water to cool it and soak the ground is the top need, with Wood next to grow into forest.' }, // 午
    { need: [4,  0], note: 'Late summer has dried this mountain to the bone. Water for the cracked ground comes first, then Wood to loosen and soften the soil.' }, // 未
    { need: [1,  4], note: 'As early autumn cools the mountain, Fire keeps the ground warm. Water comes second so the earth stays moist rather than brittle.' }, // 申
    { need: [1,  4], note: 'Cold winds sweep the mountain in mid-autumn. Sunny Fire is needed first, and Water follows to keep the land from drying out.' }, // 酉
    { need: [0,  1], note: 'Layer upon layer of late-autumn soil makes this mountain dense. Wood breaks it open first, then Fire warms the cooling ground.' }, // 戌
    { need: [0,  1], note: 'Surrounded by cold early-winter water, this mountain needs Wood to bind its soil together. Fire alongside it warms the earth.' }, // 亥
  ],
  // 5 己
  [
    { need: [1,  0], note: 'Farmland frozen in deep winter needs warm Fire most of all to thaw the soil. Wood comes next to work the ground.' }, // 子
    { need: [1,  0], note: 'Frost blankets this field in late winter. Sunny Fire warms it first, and Wood helps get ready for spring planting.' }, // 丑
    { need: [1,  3], note: 'In early spring the soil is still cold. Fire warms the field first, then Metal trims back overgrown Wood so the earth is protected.' }, // 寅
    { need: [0,  4], note: 'Mid-spring is seed time. Wood to work the soil comes first, and Water must join it to keep the ground moist.' }, // 卯
    { need: [1,  4], note: 'Late-spring soil holds a lot of moisture. Fire warms and dries the field first, and a measured amount of Water comes next.' }, // 辰
    { need: [4,  3], note: 'Early-summer sun is starting to dry out this field. Water to soak it comes first, with Metal second as the source that keeps water coming.' }, // 巳
    { need: [4,  3], note: 'A field baked dry in midsummer needs Water more than anything for its cracked soil. Metal helps by keeping the stream alive.' }, // 午
    { need: [4,  3], note: 'Late-summer heat has scorched this soil. Water to cool and moisten it is first, and Metal, which feeds that water, is second.' }, // 未
    { need: [1,  4], note: 'As early autumn cools the field, Fire keeps the soil warm. Water joins it so the ground does not turn dry and hard.' }, // 申
    { need: [1,  4], note: 'Harvest season in mid-autumn. Fire warms the cooling soil first, and Water keeps the ground moist for whatever gets planted next.' }, // 酉
    { need: [0,  1], note: 'Late-autumn soil is hardening. Wood is needed first to work the earth, and Fire backs it up, warming the field as it cools.' }, // 戌
    { need: [1,  0], note: 'Cold water pools in this field in early winter. Fire to warm the soil matters most, and Wood brings life back into it.' }, // 亥
  ],
  // 6 庚
  [
    { need: [1,  0], note: 'Metal cooled to ice in deep winter needs Fire first to warm and forge it. Wood comes next, keeping that fire going.' }, // 子
    { need: [1,  0], note: 'This ore lies buried in frozen late-winter ground. Warm Fire melts and shapes it first, and Wood helps the fire grow.' }, // 丑
    { need: [2,  1], note: 'Wood grows strong in early spring, so this metal needs Earth first to back it up. Fire follows, warming a body still chilled from winter.' }, // 寅
    { need: [1,  0], note: 'In mid-spring this metal is still unrefined. Fire is needed first to temper it, and Wood keeps that fire burning steadily.' }, // 卯
    { need: [0,  1], note: 'Thick late-spring soil can bury this metal. Wood breaks the earth open first, and Fire comes next to temper the blade.' }, // 辰
    { need: [4,  2], note: 'Early-summer heat is warming this metal fast. Water to cool it comes first, and Earth follows, wrapping it in protection.' }, // 巳
    { need: [4], note: 'Metal inside a midsummer furnace needs Water above all to cool down. When it meets water, it turns hard, clean, and bright.' }, // 午
    { need: [1,  0], note: 'Buried deep in late-summer earth, this metal needs Fire first to refine it. Wood comes next, digging it out into the open.' }, // 未
    { need: [1,  0], note: 'Early autumn is when Metal is sharpest. Fire is needed first to melt and shape it into something useful, with Wood following to sustain the flame.' }, // 申
    { need: [1,  0], note: 'Mid-autumn is Metal at full strength. Fire to forge the hard steel comes first, and Wood is second, building up that fire.' }, // 酉
    { need: [0,  4], note: 'Heavy late-autumn earth can bury this ore. Wood clears the soil first, and Water comes after, washing the metal until it shines.' }, // 戌
    { need: [1,  0], note: 'Metal sunk in cold early-winter water needs Fire most of all to warm up. Wood backs it up by kindling that fire.' }, // 亥
  ],
  // 7 辛
  [
    { need: [1,  4], note: 'A jewel frozen in deep winter needs warm Fire first. Water comes second, rinsing the stone so it sparkles.' }, // 子
    { need: [1,  4], note: 'This gem sits in frozen late-winter soil. Warming it with sunny Fire comes first, then Water washes off the dirt to reveal its shine.' }, // 丑
    { need: [2,  4], note: 'A gem in early spring is still delicate. Earth supports it first, and Water follows to polish it clean.' }, // 寅
    { need: [4,  0], note: 'A jewel set out in mid-spring shines brightest when clear Water rinses it. Wood comes next, giving its talents a stage to show off on.' }, // 卯
    { need: [4,  0], note: 'Late-spring dust can bury this jewel. Water washes it first, and Wood helps by breaking up the heavy soil.' }, // 辰
    { need: [4,  0], note: 'Early-summer heat is warming this gem. Water to cool and rinse it comes first, and Wood clears away excess earth.' }, // 巳
    { need: [4,  2], note: 'A jewel under the blazing midsummer sun needs Water most to cool off. Moist Earth comes next, cushioning it so it does not melt down.' }, // 午
    { need: [4,  3], note: 'This gem is hidden in hot late-summer soil. Water washes it and brings out its light, while Metal feeds that water from behind.' }, // 未
    { need: [4,  0], note: 'Metal is strong in early autumn, and this jewel comes alive when clear Water washes over it. Wood follows to put its talents to use.' }, // 申
    { need: [4,  0], note: 'Mid-autumn is when this jewel is at its hardest. Clear Water washing it clean comes first, and Wood widens the ways it can be used.' }, // 酉
    { need: [4,  0], note: 'Buried in dry late-autumn soil, this gem needs Water first to rinse the dirt away. Wood follows, loosening the packed earth.' }, // 戌
    { need: [4,  1], note: 'A jewel by a clear early-winter stream sparkles as Water washes over it. A touch of warm Fire helps as the season turns cold.' }, // 亥
  ],
  // 8 壬
  [
    { need: [2,  1], note: 'A river swollen in deep winter needs Earth first to guide its course. Fire is next, keeping the current from freezing over.' }, // 子
    { need: [1,  0], note: 'This river could freeze solid in late winter. Warm Fire to melt the ice matters most, and Wood keeps that fire fed.' }, // 丑
    { need: [3,  1], note: 'In early spring this river gives away much of its strength. Metal comes first to replenish the current, and Fire follows to chase off the chill.' }, // 寅
    { need: [2,  3], note: 'A river surging in mid-spring needs Earth first, working like a levee. Metal comes next to refill the source upstream.' }, // 卯
    { need: [0,  3], note: 'Late-spring soil tends to block this river. Wood clears a channel first, and Metal helps by adding to the flow.' }, // 辰
    { need: [4,  3], note: 'Early-summer heat can dry this river out. Help from other Water comes first, and Metal is second as the source that keeps it running.' }, // 巳
    { need: [4,  3], note: 'A river shrinking under the midsummer sun needs more Water to hold out. Metal must come along too, so the stream never breaks.' }, // 午
    { need: [3,  0], note: 'Late summer leaves this river blocked and drying. Metal comes first to feed the water, then Wood clears a path through the soil.' }, // 未
    { need: [2,  1], note: 'This river is rising in early autumn. Earth keeps it on course first, and warm Fire follows to take the edge off the cool air.' }, // 申
    { need: [0,  3], note: 'A clear river running through mid-autumn needs Wood first, widening its course so its talents can spread. Metal backs it up by refilling the source.' }, // 酉
    { need: [0,  1], note: 'Heavy late-autumn earth can trap this river. Wood breaks through first, and Fire then warms water that is starting to cool.' }, // 戌
    { need: [2,  1], note: 'Water gains power in early winter. Earth is needed first, acting as a dam so the river does not overflow. Fire follows to soften the cold.' }, // 亥
  ],
  // 9 癸
  [
    { need: [1,  3], note: 'Rainwater in deep winter can freeze easily. Warm Fire to thaw it comes first, and Metal follows, keeping the source clear and full.' }, // 子
    { need: [1], note: 'Dew frozen solid in late winter needs warm Fire more than anything. Once the sun comes out, whatever was stuck begins to flow again.' }, // 丑
    { need: [3,  1], note: 'Early-spring rain gives its strength to new sprouts. Metal comes first to refill the source, and Fire follows to ease the chill.' }, // 寅
    { need: [3], note: 'Rain in mid-spring pours itself into flowers and trees. Metal matters most here, refilling the water so it never runs dry.' }, // 卯
    { need: [1,  3], note: 'Late-spring rain sinks into the soil. Warm Fire comes first to brighten its energy, and Metal backs it up by refilling the source.' }, // 辰
    { need: [3,  4], note: 'Early-summer heat can dry this rain away quickly. Metal is needed first to replenish it, and other Water lends support second.' }, // 巳
    { need: [3,  4], note: 'Rain under the midsummer sun evaporates fast. Metal, the source of water, matters most, and extra Water must come with it.' }, // 午
    { need: [3,  4], note: 'Late-summer heat is drying up this rain. Metal comes first to revive the stream, and other Water is second, holding it steady.' }, // 未
    { need: [1,  0], note: 'Early autumn\'s strong Metal chills this water. Warm Fire is needed first, and Wood helps by keeping that fire going.' }, // 申
    { need: [3,  1], note: 'Like clear dew in mid-autumn, this water needs Metal first to fill its source. Warm Fire comes next to soften the cool air.' }, // 酉
    { need: [3,  0], note: 'Thick late-autumn soil tends to block this water. Metal comes first to replenish it, then Wood opens up a channel.' }, // 戌
    { need: [3,  2], note: 'Water begins to overflow in early winter. Metal comes first as a clean source, and Earth helps by keeping the flow in its channel.' }, // 亥
  ],
];

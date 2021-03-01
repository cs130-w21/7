SELECT user_id, business_id, stars, categories,
    CASE WHEN categories LIKE '%American (Traditional)%' THEN 1 ELSE 0 END AS isAmerican,
    CASE WHEN categories LIKE '%Mexican%' THEN 1 ELSE 0 END AS isMexican,
    CASE WHEN categories LIKE '%American (New)%' THEN 1 ELSE 0 END AS isAmerican,
    CASE WHEN categories LIKE '%Italian%' THEN 1 ELSE 0 END AS isItalian,
    CASE WHEN categories LIKE '%Chinese%' THEN 1 ELSE 0 END AS isChinese,
    CASE WHEN categories LIKE '%Japanese%' THEN 1 ELSE 0 END AS isJapanese,
    CASE WHEN categories LIKE '%Asian Fusion%' THEN 1 ELSE 0 END AS isAsianFusion,
    CASE WHEN categories LIKE '%Indian%' THEN 1 ELSE 0 END AS isIndian,
    CASE WHEN categories LIKE '%Thai%' THEN 1 ELSE 0 END AS isThai,
    CASE WHEN categories LIKE '%Middle Eastern%' THEN 1 ELSE 0 END AS isMiddleEastern,
    CASE WHEN categories LIKE '%Vietnamese%' THEN 1 ELSE 0 END AS isVietnamese,ß
    CASE WHEN categories LIKE '%Greek%' THEN 1 ELSE 0 END AS isGreek,
    CASE WHEN categories LIKE '%French%' THEN 1 ELSE 0 END AS isFrench,
    CASE WHEN categories LIKE '%Korean%' THEN 1 ELSE 0 END AS isKorean,
    CASE WHEN categories LIKE '%Caribbean%' THEN 1 ELSE 0 END AS isCaribbean,
    CASE WHEN categories LIKE '%Latin American%' THEN 1 ELSE 0 END AS isLatinAmerican,
    CASE WHEN categories LIKE '%Pakistani%' THEN 1 ELSE 0 END AS isPakistani,
    CASE WHEN categories LIKE '%Hawaiian%' THEN 1 ELSE 0 END AS isHawaiian,
    CASE WHEN categories LIKE '%Lebanese%' THEN 1 ELSE 0 END AS isLebanese,
    CASE WHEN categories LIKE '%Taiwanese%' THEN 1 ELSE 0 END AS isTaiwanese,
    CASE WHEN categories LIKE '%Filipino%' THEN 1 ELSE 0 END AS isFilipino,
    CASE WHEN categories LIKE '%Spanish%' THEN 1 ELSE 0 END AS isSpanish,
    CASE WHEN categories LIKE '%Irish%' THEN 1 ELSE 0 END AS isIrish,
    CASE WHEN categories LIKE '%African%' THEN 1 ELSE 0 END AS isAfrican,
    CASE WHEN categories LIKE '%Turkish%' THEN 1 ELSE 0 END AS isTurkish,
    CASE WHEN categories LIKE '%Cantonese%' THEN 1 ELSE 0 END AS isCantonese,
    CASE WHEN categories LIKE '%Pan Asian%' THEN 1 ELSE 0 END AS isPanAsian,
    CASE WHEN categories LIKE '%German%' THEN 1 ELSE 0 END AS isGerman,
    CASE WHEN categories LIKE '%Brazilian%' THEN 1 ELSE 0 END AS isBrazilian,
    CASE WHEN categories LIKE '%Ethiopian%' THEN 1 ELSE 0 END AS isEthiopian,
    CASE WHEN categories LIKE '%Polish%' THEN 1 ELSE 0 END AS isPolish,
    CASE WHEN categories LIKE '%Malaysian%' THEN 1 ELSE 0 END AS isMalaysian,
    CASE WHEN categories LIKE '%Arabian%' THEN 1 ELSE 0 END AS isArabian,
    CASE WHEN categories LIKE '%Mongolian%' THEN 1 ELSE 0 END AS isMongolian
FROM
(
SELECT A.user_id, A.business_id, A.stars, B.categories
FROM cs130_review A
LEFT OUTER JOIN cs130_business B
ON A.business_id = B.business_id
) C
LIMIT 5;

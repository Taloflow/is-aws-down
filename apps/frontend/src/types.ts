// this file was automatically generated, DO NOT EDIT
// structs
// struct2ts:github.com/austincollinpena/ads-electron/go_common/generate_ads_spreadsheets.InputKeyword
class InputKeyword {
    id: string = '';
    Keyword: string = '';
    MatchType: string = '';
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/generate_ads_spreadsheets.InputETA
class InputETA {
    headlineOne: string = '';
    headlineTwo: string = '';
    headlineThree: string = '';
    descriptionOne: string = '';
    descriptionTwo: string = '';
    pathOne: string = '';
    pathTwo: string = '';
    finalURL: string = '';
    finalURLSuffix: string = '';
    AdsIndex: number = 0;
    AdsID: string = '';
}

// struct2ts:gopkg.in/guregu/null.v4.Int
class Int {
    Int64: number = 0;
    Valid: boolean = false;
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/generate_ads_spreadsheets.ResponsiveAdCreation
class ResponsiveAdCreation {
    PathOne?: string = '';
    PathTwo?: string = '';
    FinalURL?: string = '';
    FinalURLSuffix?: string = '';
    HeadlineOne?: string = '';
    HeadlineOnePosition?: Int = new Int();
    HeadlineTwo?: string = '';
    HeadlineTwoPosition?: Int = new Int();
    HeadlineThree?: string = '';
    HeadlineThreePosition?: Int = new Int();
    HeadlineFour?: string = '';
    HeadlineFourPosition?: Int = new Int();
    HeadlineFive?: string = '';
    HeadlineFivePosition?: Int = new Int();
    HeadlineSix?: string = '';
    HeadlineSixPosition?: Int = new Int();
    HeadlineSeven?: string = '';
    HeadlineSevenPosition?: Int = new Int();
    HeadlineEight?: string = '';
    HeadlineEightPosition?: Int = new Int();
    HeadlineNine?: string = '';
    HeadlineNinePosition?: Int = new Int();
    HeadlineTen?: string = '';
    HeadlineTenPosition?: Int = new Int();
    HeadlineEleven?: string = '';
    HeadlineElevenPosition?: Int = new Int();
    HeadlineTwelve?: string = '';
    HeadlineTwelvePosition?: Int = new Int();
    HeadlineThirteen?: string = '';
    HeadlineThirteenPosition?: Int = new Int();
    HeadlineFourteen?: string = '';
    HeadlineFourteenPosition?: Int = new Int();
    HeadlineFifteen?: string = '';
    HeadlineFifteenPosition?: Int = new Int();
    DescriptionOne?: string = '';
    DescriptionOnePosition?: Int = new Int();
    DescriptionTwo?: string = '';
    DescriptionTwoPosition?: Int = new Int();
    DescriptionThree?: string = '';
    DescriptionThreePosition?: Int = new Int();
    DescriptionFour?: string = '';
    DescriptionFourPosition?: Int = new Int();
    AdsIndex: number = 0;
    AdsID: string = '';
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/generate_ads_spreadsheets.InputAdGroup
class InputAdGroup {
    adGroupName: string = '';
    keywordTemplating: InputKeyword[] | null = null;
    ETATemplating: InputETA[] | null = null;
    RSATemplating: ResponsiveAdCreation[] | null = null;
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/generate_ads_spreadsheets.CampaignBuilder
class CampaignBuilder {
    CampaignName: string = '';
    adGroups: InputAdGroup[] | null = null;
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/generate_ads_spreadsheets.ReturnValue
class ReturnValue {
    Variable: string = '';
    Values: string[] | null = null;
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/ad_intelligence.Params
class Params {
    Query: string = '';
    Location: string = '';
    Language: string = '';
    SearchEngine: string = '';
    IsDesktop: boolean = false;
    IsMobile: boolean = false;
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/ad_intelligence.AdResponse
class AdResponse {
    PaidPosition: string = '';
    Headline: string = '';
    Description: string = '';
    URL: string = '';
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/ad_intelligence.OrganicResponse
class OrganicResponse {
    Position: number = 0;
    Title: string = '';
    DestinationURL: string = '';
    DisplayURL: string = '';
    Description: string = '';
}

// struct2ts:github.com/austincollinpena/ads-electron/go_common/ad_intelligence.FullResponse
class FullResponse {
    Ads: AdResponse[] | null = null;
    Organic: OrganicResponse[] | null = null;
    RelatedSearches: string[] | null = null;
}

// struct2ts:github.com/austincollinpena/ads-electron/rest_api/api_responses.ErrorMessage
class ErrorMessage {
    Message: string = '';
}

// exports
export {
    InputKeyword,
    InputETA,
    Int,
    ResponsiveAdCreation,
    InputAdGroup,
    CampaignBuilder,
    ReturnValue,
    Params,
    AdResponse,
    OrganicResponse,
    FullResponse,
    ErrorMessage,
};

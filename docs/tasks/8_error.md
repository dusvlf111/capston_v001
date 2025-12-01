## Error Type
Runtime ZodError

## Error Message
[
  {
    "expected": "number",
    "code": "invalid_type",
    "path": [
      "location",
      "coordinates",
      "latitude"
    ],
    "message": "Invalid input: expected number, received undefined"
  },
  {
    "expected": "number",
    "code": "invalid_type",
    "path": [
      "location",
      "coordinates",
      "longitude"
    ],
    "message": "Invalid input: expected number, received undefined"
  },
  {
    "origin": "string",
    "code": "too_small",
    "minimum": 1,
    "inclusive": true,
    "path": [
      "activity",
      "startTime"
    ],
    "message": "시작 시간을 입력하세요."
  },
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "datetime",
    "pattern": "/^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z))$/",
    "path": [
      "activity",
      "startTime"
    ],
    "message": "시작 시간을 ISO 형식으로 입력하세요."
  },
  {
    "origin": "string",
    "code": "too_small",
    "minimum": 1,
    "inclusive": true,
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간을 입력하세요."
  },
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "datetime",
    "pattern": "/^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z))$/",
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간을 ISO 형식으로 입력하세요."
  },
  {
    "code": "custom",
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간은 시작 시간 이후여야 합니다."
  }
]

Next.js version: 16.0.3 (Turbopack)
## Error Type
Runtime ZodError

## Error Message
[
  {
    "origin": "string",
    "code": "too_small",
    "minimum": 1,
    "inclusive": true,
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간을 입력하세요."
  },
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "datetime",
    "pattern": "/^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z))$/",
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간을 ISO 형식으로 입력하세요."
  },
  {
    "code": "custom",
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간은 시작 시간 이후여야 합니다."
  }
]

Next.js version: 16.0.3 (Turbopack)
## Error Type
Runtime ZodError

## Error Message
[
  {
    "origin": "string",
    "code": "too_small",
    "minimum": 1,
    "inclusive": true,
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간을 입력하세요."
  },
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "datetime",
    "pattern": "/^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z))$/",
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간을 ISO 형식으로 입력하세요."
  },
  {
    "code": "custom",
    "path": [
      "activity",
      "endTime"
    ],
    "message": "종료 시간은 시작 시간 이후여야 합니다."
  }
]

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
C:\Users\dusvl\OneDrive\Documents\workspace\capston_v001\.next\dev\server\chunks\ssr\node_modules_21bc79f6._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at generateSafetyReport (src\lib\services\aiService.ts:85:21)
    at buildReportInsights (src\lib\services\reportInsightsService.ts:82:20)
    at ReportResultPage (src\app\report\result\[id]\page.tsx:31:51)
    at ReportResultPage (<anonymous>:null:null)

## Code Frame
  83 |             });
  84 |         } catch (error) {
> 85 |             console.warn('Primary model failed, falling back to gpt-4o-mini:', error);
     |                     ^
  86 |             completion = await openai.chat.completions.create({
  87 |                 model: "gpt-4o-mini",
  88 |                 messages: [

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
C:\Users\dusvl\OneDrive\Documents\workspace\capston_v001\.next\dev\server\chunks\ssr\[root-of-the-server]__98418e22._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at generateSafetyReport (src\lib\services\aiService.ts:85:21)
    at buildReportInsights (src\lib\services\reportInsightsService.ts:82:20)
    at ReportResultPage (src\app\report\result\[id]\page.tsx:31:51)
    at ReportResultPage (<anonymous>:null:null)

## Code Frame
  83 |             });
  84 |         } catch (error) {
> 85 |             console.warn('Primary model failed, falling back to gpt-4o-mini:', error);
     |                     ^
  86 |             completion = await openai.chat.completions.create({
  87 |                 model: "gpt-4o-mini",
  88 |                 messages: [

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.


    at generateSafetyReport (src\lib\services\aiService.ts:86:26)
    at buildReportInsights (src\lib\services\reportInsightsService.ts:82:20)
    at ReportResultPage (src\app\report\result\[id]\page.tsx:31:51)
    at ReportResultPage (<anonymous>:null:null)

## Code Frame
  84 |         } catch (error) {
  85 |             console.warn('Primary model failed, falling back to gpt-4o-mini:', error);
> 86 |             completion = await openai.chat.completions.create({
     |                          ^
  87 |                 model: "gpt-4o-mini",
  88 |                 messages: [
  89 |                     { role: "system", content: "You are a helpful marine safety assistant." },

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
C:\Users\dusvl\OneDrive\Documents\workspace\capston_v001\.next\dev\server\chunks\ssr\node_modules_21bc79f6._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at generateSafetyReport (src\lib\services\aiService.ts:102:17)
    at buildReportInsights (src\lib\services\reportInsightsService.ts:82:20)
    at ReportResultPage (src\app\report\result\[id]\page.tsx:31:51)
    at ReportResultPage (<anonymous>:null:null)

## Code Frame
  100 |
  101 |     } catch (error) {
> 102 |         console.error('Failed to generate AI safety report:', error);
      |                 ^
  103 |         // Fallback or re-throw depending on requirements
  104 |         return null;
  105 |     }

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
C:\Users\dusvl\OneDrive\Documents\workspace\capston_v001\.next\dev\server\chunks\ssr\[root-of-the-server]__98418e22._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at generateSafetyReport (src\lib\services\aiService.ts:102:17)
    at buildReportInsights (src\lib\services\reportInsightsService.ts:82:20)
    at ReportResultPage (src\app\report\result\[id]\page.tsx:31:51)
    at ReportResultPage (<anonymous>:null:null)

## Code Frame
  100 |
  101 |     } catch (error) {
> 102 |         console.error('Failed to generate AI safety report:', error);
      |                 ^
  103 |         // Fallback or re-throw depending on requirements
  104 |         return null;
  105 |     }

Next.js version: 16.0.3 (Turbopack)

import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AttributionService } from './attribution.service';
import {
  AttributionQueryDto,
  AttributionResultDto,
  AttributionModelDto,
  JourneyQueryDto,
  JourneyResultDto,
  TouchpointQueryDto,
  TouchpointResultDto,
} from './dto/attribution.dto';

@ApiTags('Attribution')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class AttributionController {
  constructor(private readonly attributionService: AttributionService) {}

  @Get('attribution')
  @ApiOperation({
    summary: 'Get multi-touch attribution analysis',
    description: `
Calculates marketing attribution using various models to understand channel effectiveness.

**Supported Models:**
- \`first_touch\` - 100% credit to first interaction
- \`last_touch\` - 100% credit to last interaction before conversion
- \`linear\` - Equal credit to all touchpoints
- \`time_decay\` - More credit to recent touchpoints
- \`position_based\` - 40/20/40 split (first/middle/last)
- \`data_driven\` - ML-based attribution using Shapley values

**Use Cases:**
- Optimize marketing spend allocation
- Understand channel contribution
- Measure campaign ROI
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Attribution analysis results',
    type: AttributionResultDto,
  })
  async getAttribution(@Query() query: AttributionQueryDto): Promise<AttributionResultDto> {
    return this.attributionService.calculateAttribution(query);
  }

  @Get('attribution/models')
  @ApiOperation({
    summary: 'Get available attribution models',
    description: `
Returns all available attribution models and their configurations.

Each model includes:
- Model ID and name
- Description of how credit is assigned
- Configuration options (if applicable)
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'List of attribution models',
    type: [AttributionModelDto],
  })
  getAttributionModels(): AttributionModelDto[] {
    return this.attributionService.getAvailableModels();
  }

  @Get('journey')
  @ApiOperation({
    summary: 'Get customer journey mapping',
    description: `
Maps customer journeys showing the sequence of touchpoints from first interaction to conversion.

**Features:**
- Full touchpoint sequence for each user
- Journey duration and length metrics
- Conversion tracking
- Filter by user or conversion status

**Use Cases:**
- Understand common conversion paths
- Identify friction points in the journey
- Optimize touchpoint sequencing
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer journey data',
    type: JourneyResultDto,
  })
  async getJourneys(@Query() query: JourneyQueryDto): Promise<JourneyResultDto> {
    return this.attributionService.getCustomerJourneys(query);
  }

  @Get('touchpoints')
  @ApiOperation({
    summary: 'Get touchpoint analysis',
    description: `
Analyzes individual touchpoints to understand their role in the customer journey.

**Metrics:**
- Total touchpoint volume
- Position in journey (first, middle, last touch)
- Average position
- Conversion rate when touchpoint is present

**Grouping Options:**
- By channel
- By campaign
- By source
- By medium

**Use Cases:**
- Identify high-value touchpoints
- Optimize channel mix
- Understand touchpoint sequencing
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Touchpoint analysis data',
    type: TouchpointResultDto,
  })
  async getTouchpoints(@Query() query: TouchpointQueryDto): Promise<TouchpointResultDto> {
    return this.attributionService.analyzeTouchpoints(query);
  }
}

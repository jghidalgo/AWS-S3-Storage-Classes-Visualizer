# AWS S3 Storage Classes Visualizer

An interactive web application that demonstrates AWS S3 storage classes, lifecycle policies, and cost optimization strategies through visual simulations and real-time calculations.

## Features

- **Interactive Storage Class Comparison**: Visual representation of all S3 storage tiers
- **Lifecycle Policy Simulation**: Watch files automatically transition between storage classes
- **Cost Calculator**: Compare storage costs across different classes and time periods
- **File Management**: Upload, retrieve, and delete files with realistic timing simulations
- **Timeline Visualization**: See the progression of files through lifecycle stages
- **Real-time Metrics**: Track file counts and costs for each storage class

## Storage Classes Covered

### S3 Standard
- **Cost**: $0.023/GB/month
- **Retrieval**: Instant, Free
- **Use Case**: Frequently accessed data, websites, content distribution
- **Availability**: 99.99%

### S3 Standard-IA (Infrequent Access)
- **Cost**: $0.0125/GB/month
- **Retrieval**: Instant, $0.01/GB
- **Use Case**: Infrequently accessed data, backups, disaster recovery
- **Availability**: 99.9%

### S3 Glacier Flexible Retrieval
- **Cost**: $0.004/GB/month
- **Retrieval**: 1-5 minutes, $0.03/GB
- **Use Case**: Long-term archival, compliance, rarely accessed data
- **Availability**: 99.99%

### S3 Glacier Deep Archive
- **Cost**: $0.00099/GB/month
- **Retrieval**: 12 hours, $0.02/GB
- **Use Case**: Long-term retention, regulatory compliance, digital preservation
- **Availability**: 99.99%

## How to Use

### File Operations
1. **Upload Files**: Enter filename and size, then upload to S3 Standard
2. **Simulate Lifecycle**: Advance time by 30 days to see automatic transitions
3. **Retrieve Files**: Test retrieval times and costs from different storage classes
4. **Delete Files**: Remove files from storage

### Cost Analysis
1. **Cost Calculator**: Enter data size and duration to compare storage costs
2. **Real-time Tracking**: See individual file costs update as they transition
3. **Optimization Insights**: Identify the most cost-effective storage class

### Lifecycle Policies
1. **Configure Rules**: Set transition days for each storage class
2. **Apply Policies**: Watch files automatically move between tiers
3. **Custom Scenarios**: Test different retention strategies

## Key Learning Points

### Cost Optimization
- **Standard**: Best for frequently accessed data despite higher cost
- **Standard-IA**: 46% cheaper than Standard for infrequent access
- **Glacier**: 83% cheaper than Standard for archival needs
- **Deep Archive**: 96% cheaper than Standard for long-term retention

### Retrieval Considerations
- **Instant Access**: Standard and Standard-IA provide immediate retrieval
- **Planned Retrieval**: Glacier requires 1-5 minutes for expedited retrieval
- **Batch Processing**: Deep Archive suits planned, bulk retrievals (12 hours)

### Lifecycle Strategy
- **Automatic Transitions**: Reduce costs without manual intervention
- **Access Patterns**: Match storage class to actual usage patterns
- **Compliance Requirements**: Meet retention policies cost-effectively

## Interactive Features

### Visual Elements
- **Color-coded Storage Classes**: Easy identification of file locations
- **Timeline Progression**: Visual representation of lifecycle stages
- **Real-time Updates**: Live metrics and cost calculations
- **Responsive Design**: Works on desktop and mobile devices

### Simulation Capabilities
- **Realistic Timing**: Accurate retrieval time simulations
- **Cost Modeling**: Based on actual AWS pricing
- **Lifecycle Automation**: Demonstrates automatic transitions
- **Policy Testing**: Experiment with different retention strategies

## Educational Value

Perfect for:
- **Cloud Architects** designing cost-effective storage strategies
- **Developers** learning S3 optimization techniques
- **Students** studying cloud storage concepts
- **IT Managers** evaluating storage costs and policies
- **Anyone** wanting to understand S3 storage classes visually

## Code Examples Included

The visualizer includes real AWS CLI examples for:
- Uploading files to specific storage classes
- Configuring lifecycle policies
- Retrieving files from Glacier and Deep Archive
- Managing storage transitions

## Understanding the Visualization

### File States
- **Green Border**: S3 Standard (frequent access)
- **Blue Border**: S3 Standard-IA (infrequent access)
- **Orange Border**: S3 Glacier (archival)
- **Red Border**: S3 Deep Archive (long-term retention)

### Timeline Markers
- **Active**: Current stage in lifecycle
- **Completed**: Stages already passed
- **Upcoming**: Future transition points

### Cost Indicators
- **Real-time Calculation**: Updates as files age and transition
- **Comparative Analysis**: Shows cost differences between classes
- **Optimization Suggestions**: Highlights most cost-effective options

## Technical Implementation

- **Pure Frontend**: HTML, CSS, and JavaScript only
- **No Dependencies**: Runs in any modern browser
- **Responsive Design**: Mobile and desktop compatible
- **Real-time Calculations**: Based on actual AWS pricing
- **Interactive Animations**: Smooth transitions and visual feedback

## Browser Compatibility

Works in all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported
- No plugins required

Start exploring AWS S3 storage optimization with this comprehensive visualizer!
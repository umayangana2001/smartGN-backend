@Get('gn/division/:division/request/:requestId')
@UseGuards(RolesGuard)
@Roles(Role.VILLAGE_OFFICER)
@ApiOperation({
  summary: 'GN: Get service request by division and request ID',
})
@ApiParam({ name: 'division', description: 'GN division name' })
@ApiParam({ name: 'requestId', description: 'Service request ID' })
async getRequestByDivisionAndId(
  @Param('division') division: string,
  @Param('requestId') requestId: string,
) {
  return this.serviceRequestService.getRequestByDivisionAndId(
    division,
    requestId,
  );
}